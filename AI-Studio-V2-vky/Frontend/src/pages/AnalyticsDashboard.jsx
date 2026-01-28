import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../services/tokenService";
 
const AnalyticsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30D");
  const [customDays, setCustomDays] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customUsageData, setCustomUsageData] = useState([]);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);
  const [customError, setCustomError] = useState("");
  const [animateStats, setAnimateStats] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
 
  const [metrics, setMetrics] = useState({
    totalCalls: 0,
    totalCallsPrev: 0,
    totalCost: 0,
    totalCostPrev: 0,
    tokensUsed: 0,
    tokensUsedPrev: 0,
    successRate: 0,
    successRatePrev: 0,
    avgResponseTime: 0,
    avgResponseTimePrev: 0,
    activeProjects: 0,
    activeProjectsPrev: 0,
  });
 
  const [usageSeries, setUsageSeries] = useState({
    "7D": [],
    "30D": [],
    "90D": [],
    "1Y": [],
  });
  const [modelDistribution, setModelDistribution] = useState([]);
 
  const toDisplayModelName = useCallback((code) => {
    const name = String(code || "").toLowerCase();
    if (name === "gpt-5" || name.startsWith("gpt-5")) return "GPT-5";
    if (name.startsWith("gpt-4-32k")) return "GPT-4 32K";
    if (name.startsWith("gpt-4-0613") || name === "gpt-4") return "GPT-4";
    if (name.startsWith("gpt-4o-mini")) return "GPT-4o Mini";
    if (name.startsWith("gpt-4o")) return "GPT-4o";
    if (name.startsWith("gpt-3.5-turbo")) return "GPT-3.5 Turbo";
    if (name.includes("davinci")) return "GPT-3.0 (Davinci)";
    if (name.includes("curie")) return "Curie";
    if (name.includes("babbage")) return "Babbage";
    if (name.includes("ada")) return "Ada";
    if (name.includes("3.5") && name.includes("mini")) return "GPT-3.5 Mini";
    if (name.includes("3.5") && name.includes("nano")) return "GPT-3.5 Nano";
    if (
      (name.includes("3.0") || name.includes("gpt-3")) &&
      (name.includes("tiny") || name.includes("nano"))
    )
      return "GPT-3.0 Tiny/Nano";
    return code || "Unknown Model";
  }, []);
 
  const formatXAxisTick = useCallback((value) => String(value || ""), []);
 
  const formatNumber = useCallback((num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return Number(num || 0).toLocaleString();
  }, []);
 
  const formatCurrency = useCallback((amount) => {
    const num = Number(amount || 0);
    if (num >= 1) return `$${num.toFixed(2)}`;
    if (num >= 0.01) return `$${num.toFixed(2)}`;
    if (num >= 0.0001) return `$${num.toFixed(4)}`;
    return `$${num.toFixed(6)}`;
  }, []);
 
  const fetchCustomUsage = useCallback(async (days) => {
    setIsLoadingCustom(true);
    setCustomError("");
 
    try {
      const response = await api.get(`/api/analytics/usage?custom_days=${days}`);
      setCustomUsageData(response.data.series || []);
    } catch (error) {
      console.error("Failed to fetch custom usage data:", error);
      if (error.response?.status === 401) {
        setAuthError(true);
        setCustomError("Authentication required. Please login.");
      } else {
        setCustomError(error.message || "Failed to load custom data");
      }
      setCustomUsageData([]);
    } finally {
      setIsLoadingCustom(false);
    }
  }, []);
 
  const handleCustomDaysSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const days = parseInt(customDays);
 
      if (isNaN(days) || days < 1 || days > 3650) {
        setCustomError("Please enter a valid number between 1 and 3650 days");
        return;
      }
 
      setIsCustomMode(true);
      fetchCustomUsage(days);
    },
    [customDays, fetchCustomUsage]
  );
 
  const percentChange = (current, prev) => {
    if (!prev) return 0;
    return ((current - prev) / prev) * 100;
  };
 
  const handleTimeRangeChange = useCallback((range) => {
    setSelectedTimeRange(range);
    setIsCustomMode(false);
    setCustomError("");
    setCustomUsageData([]);
  }, []);
 
  const resetToPresetMode = useCallback(() => {
    setIsCustomMode(false);
    setCustomDays("");
    setCustomError("");
    setCustomUsageData([]);
    setSelectedTimeRange("30D");
  }, []);
 
  // WebSocket connection - cookies are sent automatically
  const connect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
 
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      // const backendUrl = "http://localhost:8077";
      const protocol = backendUrl.startsWith("https:") ? "wss:" : "ws:";
      const host = backendUrl.replace(/^https?:\/\//, "");
      
      // WebSocket will automatically send cookies with the request
      const wsUrl = `${protocol}//${host}/api/ws/analytics`;
 
      console.log("🔌 Connecting to WebSocket...", wsUrl);
      setDebugInfo("Connecting to WebSocket...");
 
      wsRef.current = new WebSocket(wsUrl);
 
      wsRef.current.onopen = () => {
        console.log("✅ WebSocket connected successfully!");
        setIsConnected(true);
        setAuthError(false);
        setDebugInfo("Connected - receiving live updates");
      };
 
      wsRef.current.onclose = (event) => {
        console.log("🔌 WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
 
        // 1008 = Policy Violation (usually auth failure)
        // 1002 = Protocol Error
        if (event.code === 1008 || event.code === 1002 || event.code === 1011) {
          console.error("❌ WebSocket authentication failed");
          setAuthError(true);
          setDebugInfo("Authentication failed - please login");
          return;
        }
 
        // Normal closure, attempt reconnect
        const delay = Math.min(1000 * Math.pow(2, Math.random()), 30000);
        console.log(`🔄 Reconnecting in ${Math.round(delay/1000)}s...`);
        setDebugInfo(`Reconnecting in ${Math.round(delay/1000)}s...`);
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };
 
      wsRef.current.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setIsConnected(false);
        setDebugInfo("Connection error - retrying...");
      };
 
      wsRef.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (!data) return;
 
          if (data.metrics) {
            setMetrics(prev => ({
              ...prev,
              totalCalls: data.metrics.totalCalls ?? prev.totalCalls,
              totalCallsPrev: data.metrics.totalCallsPrev ?? prev.totalCallsPrev,
              totalCost: data.metrics.totalCost ?? prev.totalCost,
              totalCostPrev: data.metrics.totalCostPrev ?? prev.totalCostPrev,
              tokensUsed: data.metrics.tokensUsed ?? prev.tokensUsed,
              tokensUsedPrev: data.metrics.tokensUsedPrev ?? prev.tokensUsedPrev,
              successRate: data.metrics.successRate ?? prev.successRate,
              successRatePrev: data.metrics.successRatePrev ?? prev.successRatePrev,
              avgResponseTime: data.metrics.avgResponseTime ?? prev.avgResponseTime,
              avgResponseTimePrev: data.metrics.avgResponseTimePrev ?? prev.avgResponseTimePrev,
              activeProjects: data.metrics.activeProjects ?? prev.activeProjects,
              activeProjectsPrev: data.metrics.activeProjectsPrev ?? prev.activeProjectsPrev,
            }));
          }
 
          if (data.usageSeries) {
            setUsageSeries(data.usageSeries);
          }
 
          if (Array.isArray(data.modelDistribution)) {
            const mapped = data.modelDistribution.map((m) => {
              const rawModel =
                m?.name ||
                m?.model ||
                m?.model_name ||
                m?.engine ||
                "unknown";
 
              return {
                name: toDisplayModelName(rawModel),
                value: m?.value ?? m?.count ?? 0,
              };
            });
 
            setModelDistribution(mapped);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      setIsConnected(false);
      setDebugInfo(`Connection failed: ${error.message}`);
      reconnectTimeoutRef.current = setTimeout(connect, 5000);
    }
  }, [toDisplayModelName]);
 
  useEffect(() => {
    // Check if user is authenticated before connecting
    api.get("/api/auth/profile")
      .then(() => {
        console.log("✅ User authenticated, connecting WebSocket...");
        connect();
      })
      .catch((error) => {
        console.error("❌ Not authenticated:", error);
        setAuthError(true);
        setDebugInfo("Please login to view analytics");
      });
 
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);
 
  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 100);
    return () => clearTimeout(timer);
  }, []);
 
  const currentChartData = useMemo(() => {
    if (isCustomMode) {
      return customUsageData;
    }
    return usageSeries[selectedTimeRange] || [];
  }, [isCustomMode, customUsageData, usageSeries, selectedTimeRange]);
 
  const currentChartTitle = useMemo(() => {
    if (isCustomMode) {
      return `API Usage - Last ${customDays} Days`;
    }
    return "API Usage Over Time";
  }, [isCustomMode, customDays]);
 
  const statsData = useMemo(() => {
    const callsChange = percentChange(metrics.totalCalls, metrics.totalCallsPrev);
    const costChange = percentChange(metrics.totalCost, metrics.totalCostPrev);
    const tokenChange = percentChange(metrics.tokensUsed, metrics.tokensUsedPrev);
    const successChange = metrics.successRate - metrics.successRatePrev;
    const responseChange = percentChange(metrics.avgResponseTimePrev, metrics.avgResponseTime);
    const projectChange = metrics.activeProjects - metrics.activeProjectsPrev;
 
    return [
      {
        title: "Total API Calls",
        value: formatNumber(metrics.totalCalls),
        change: `${callsChange.toFixed(1)}%`,
        positive: callsChange >= 0,
        icon: "🔥",
      },
      {
        title: "Total Cost",
        value: formatCurrency(metrics.totalCost),
        change: `${costChange.toFixed(1)}%`,
        positive: costChange >= 0,
        icon: "💰",
      },
      {
        title: "Tokens Used",
        value: formatNumber(metrics.tokensUsed),
        change: `${tokenChange.toFixed(1)}%`,
        positive: tokenChange >= 0,
        icon: "🎯",
      },
      {
        title: "Success Rate",
        value: `${metrics.successRate}%`,
        change: `${successChange.toFixed(2)}%`,
        positive: successChange >= 0,
        icon: "✅",
      },
      {
        title: "Avg Response Time",
        value: `${metrics.avgResponseTime}s`,
        change: `${responseChange.toFixed(1)}% faster`,
        positive: responseChange > 0,
        icon: "⚡",
      },
      {
        title: "Active Projects",
        value: metrics.activeProjects,
        change: `${projectChange >= 0 ? "+" : ""}${projectChange}`,
        positive: projectChange >= 0,
        icon: "📱",
      },
    ];
  }, [metrics, formatNumber, formatCurrency]);
 
  const ConnectionStatus = () => (
    <div className="flex flex-col items-end gap-1">
      <div
        className={`flex items-center gap-2 text-xs ${
          isConnected ? "text-green-400" : authError ? "text-red-400" : "text-yellow-400"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-400 animate-pulse" : authError ? "bg-red-400" : "bg-yellow-400"
          }`}
        ></div>
        <span>
          {isConnected ? "Live Updates Active" : authError ? "Authentication Required" : "Reconnecting..."}
        </span>
      </div>
      {debugInfo && (
        <div className="text-xs text-slate-400 max-w-xs text-right">
          {debugInfo}
        </div>
      )}
      {authError && (
        <button
          onClick={() => window.location.href = '/login'}
          className="text-xs text-red-400 hover:text-red-300 underline"
        >
          Click here to login
        </button>
      )}
    </div>
  );
 
  const StatCard = ({ stat, index }) => (
    <div
      className={`bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-6 relative overflow-hidden ${
        animateStats ? "animate-fade-in" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm text-slate-400 font-medium">{stat.title}</div>
        <div className="text-2xl p-2 bg-indigo-500/10 rounded-lg">
          {stat.icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
      <div
        className={`flex items-center gap-1 text-xs ${
          stat.positive ? "text-green-400" : "text-red-400"
        }`}
      >
        <span>{stat.positive ? "↗" : "↘"}</span>
        <span>{stat.change} from last month</span>
      </div>
    </div>
  );
 
  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-6 border-b border-slate-700 bg-slate-900">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Analytics Dashboard</h1>
              <p className="text-slate-400 text-sm">
                Monitor your AI usage, costs, and performance metrics
              </p>
            </div>
            <ConnectionStatus />
          </div>
        </div>
 
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
            <div className="xl:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{currentChartTitle}</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 flex-wrap">
                    {["7D", "30D", "90D", "1Y"].map((r) => (
                      <button
                        key={r}
                        onClick={() => handleTimeRangeChange(r)}
                        disabled={isLoadingCustom}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          selectedTimeRange === r && !isCustomMode
                            ? "bg-indigo-500 text-white"
                            : "border border-slate-600 text-slate-400 hover:text-white disabled:opacity-50"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
 
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="3650"
                      placeholder="Custom days"
                      value={customDays}
                      onChange={(e) => setCustomDays(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCustomDaysSubmit(e);
                        }
                      }}
                      disabled={isLoadingCustom}
                      className="px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 w-28 disabled:opacity-50"
                    />
                    <button
                      onClick={handleCustomDaysSubmit}
                      disabled={isLoadingCustom || !customDays.trim()}
                      className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded-md transition-colors"
                    >
                      {isLoadingCustom ? "..." : "Go"}
                    </button>
 
                    {isCustomMode && (
                      <button
                        onClick={resetToPresetMode}
                        className="px-2 py-1 text-xs text-slate-400 hover:text-white border border-slate-600 rounded-md transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
 
                  {isLoadingCustom && (
                    <div className="text-xs text-blue-400 bg-blue-900/20 border border-blue-800 rounded-md p-2">
                      Loading custom data...
                    </div>
                  )}
 
                  {customError && (
                    <div className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-md p-2">
                      {customError}
                    </div>
                  )}
 
                  {isCustomMode && !customError && !isLoadingCustom && (
                    <div className="text-xs text-green-400 bg-green-900/20 border border-green-800 rounded-md p-2">
                      Showing custom {customDays} days • {currentChartData.length} data points
                    </div>
                  )}
                </div>
              </div>
              <div className="h-64 relative">
                {isLoadingCustom && isCustomMode && (
                  <div className="absolute inset-0 bg-slate-800/80 flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading custom data...</span>
                    </div>
                  </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentChartData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={formatXAxisTick}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="calls"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
 
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4">Model Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {(modelDistribution || []).map((entry, i) => {
                        const colors = [
                          "#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b",
                          "#10b981", "#ef4444", "#14b8a6", "#a78bfa",
                        ];
                        return <Cell key={i} fill={colors[i % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-2">
                {(() => {
                  const total = (modelDistribution || []).reduce(
                    (acc, cur) => acc + (cur.value || 0),
                    0
                  );
                  const colors = [
                    "#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b",
                    "#10b981", "#ef4444", "#14b8a6", "#a78bfa",
                  ];
                  return (modelDistribution || []).map((m, i) => {
                    const pct = total > 0 ? ((m.value / total) * 100).toFixed(1) : "0.0";
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: colors[i % colors.length] }}
                        ></div>
                        <span className="text-xs text-slate-300">{m.name}</span>
                        <span className="text-xs text-slate-400 ml-auto">
                          {pct}% • {m.value}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
 
          <div className="font-bold text-2xl p-1 mb-3">
            <h2 className="text-lg font-semibold text-white">
              Monthly Usage Stats
            </h2>
            <p className="text-xs text-slate-400">
              Based on a rolling 30-day window
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {statsData.map((s, i) => (
              <StatCard key={s.title} stat={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default AnalyticsDashboard;