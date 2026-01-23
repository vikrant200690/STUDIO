
import React, { useState, useEffect } from "react";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8077';
import {
  Search,
  Filter,
  Download,
  Star,
  Settings,
  Zap,
  Code,
  Database,
  MessageSquare,
  Globe,
  Shield,
  Brain,
  FileText,
  Image,
  Music,
  Video,
  Palette,
  Calculator,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Package,
  Link,
  Activity,
  Cog,
  GitBranch,
  Server,
  Eye,
  Wrench
} from "lucide-react";

const Plugins = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: "all", name: "All Plugins", icon: <Package className="w-4 h-4" /> },
    { id: "ai", name: "AI & Intelligence", icon: <Brain className="w-4 h-4" /> },
    { id: "infrastructure", name: "Infrastructure", icon: <Server className="w-4 h-4" /> },
    { id: "logging", name: "Logging & Analytics", icon: <Activity className="w-4 h-4" /> },
    { id: "configuration", name: "Configuration", icon: <Cog className="w-4 h-4" /> },
    { id: "integration", name: "Integration", icon: <Link className="w-4 h-4" /> }
  ];

  const iconMap = {
    Brain: <Brain className="w-6 h-6" />,
    GitBranch: <GitBranch className="w-6 h-6" />,
    Eye: <Eye className="w-6 h-6" />,
    Settings: <Settings className="w-6 h-6" />,
    Link: <Link className="w-6 h-6" />
  };

  // Load plugins from JSON file
  useEffect(() => {
    const loadPlugins = async () => {
      try {
        setLoading(true);
        const response = await fetch('/plugins.json'); // Adjust path as needed
        if (!response.ok) {
          throw new Error('Failed to load plugins');
        }
        const pluginsData = await response.json();
        console.log(pluginsData)
        // Map iconName to actual icon component
        const pluginsWithIcons = pluginsData.map(plugin => ({
          ...plugin,
          icon: iconMap[plugin.iconName] || <Package className="w-6 h-6" />
        }));
        
        setPlugins(pluginsWithIcons);
      } catch (err) {
        setError(err.message);
        console.error('Error loading plugins:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlugins();
  }, []);

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || plugin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPlugins = plugins.filter(plugin => plugin.featured);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-500/20";
      case "beta": return "text-yellow-400 bg-yellow-500/20";
      case "inactive": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return <CheckCircle className="w-3 h-3" />;
      case "beta": return <AlertCircle className="w-3 h-3" />;
      case "inactive": return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white/60">Loading plugins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-2">Error loading plugins</p>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 overflow-y-auto">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 8 + "s",
              animationDuration: 8 + Math.random() * 4 + "s"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-400" />
                Plugins
              </h1>
              <p className="text-white/60 text-lg">
                Extend your AI Studio with powerful plugins
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <span className="text-sm text-blue-300">{plugins.length} plugins available</span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search plugins..."
                className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                      : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Plugins */}
        {featuredPlugins.length > 0 && selectedCategory === "all" && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Featured Plugins
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredPlugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedPlugin(plugin)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${plugin.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${plugin.color} bg-opacity-20`}>
                        {plugin.icon}
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plugin.status)}`}>
                        {getStatusIcon(plugin.status)}
                        {plugin.status}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{plugin.name}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{plugin.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {plugin.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {plugin.downloads}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Plugins */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            All Plugins ({filteredPlugins.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPlugins.map((plugin) => (
              <div
                key={plugin.id}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedPlugin(plugin)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${plugin.color} bg-opacity-20 flex-shrink-0`}>
                    {plugin.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold truncate">{plugin.name}</h3>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plugin.status)}`}>
                        {getStatusIcon(plugin.status)}
                        {plugin.status}
                      </div>
                    </div>
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">{plugin.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {plugin.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                          {tag}
                        </span>
                      ))}
                      {plugin.tags.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60">
                          +{plugin.tags.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {plugin.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {plugin.downloads}
                        </div>
                        <div>v{plugin.version}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plugin Details Modal */}
        {selectedPlugin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${selectedPlugin.color} bg-opacity-20`}>
                      {selectedPlugin.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPlugin.name}</h2>
                      <p className="text-white/60">by {selectedPlugin.author}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPlugin(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-xs">Version</div>
                    <div className="font-semibold">{selectedPlugin.version}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-xs">Downloads</div>
                    <div className="font-semibold">{selectedPlugin.downloads}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-xs">Size</div>
                    <div className="font-semibold">{selectedPlugin.size}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-xs">Updated</div>
                    <div className="font-semibold">{selectedPlugin.lastUpdated}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-white/80 leading-relaxed">{selectedPlugin.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedPlugin.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlugin.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${selectedPlugin.color} rounded-lg font-medium hover:opacity-90 transition-opacity`}>
                   <a
                        href={`${VITE_BACKEND_URL}/api/plugins/download/${selectedPlugin.id}`}
                        download
                        className="btn"
                      >
                        <Download className="w-4 h-4" />
                        Install Plugin
                      </a>
                  </button>
                  <button className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 8s infinite linear;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Plugins;