import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Crown,
  Sparkles,
  Zap,
  Bot,
  Cpu,
  Wand2,
  Rocket,
  Plus,
  ArrowRight,
  Star,
  Bell,
  Settings,
  User,
  Filter,
  Grid3X3,
  List,
  Bookmark,
  TrendingUp,
  Globe,
  Shield,
  ChevronDown,
  Menu,
  X,
  BarChart3,
  Code2,
  Layers,
  BookOpen,
  Link,
} from "lucide-react";
import { NavLink } from "react-router-dom";
const Studio = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const filters = [
    { id: "all", label: "All Models", count: 3 },
    { id: "new", label: "New", count: 12, icon: <Star className="w-3 h-3" /> },
    {
      id: "featured",
      label: "Featured",
      count: 8,
      icon: <Crown className="w-3 h-3" />,
    },
    { id: "ai-assistant", label: "AI Assistant", count: 45 },
    { id: "creative", label: "Creative", count: 32 },
    { id: "developer", label: "Developer", count: 12 },
  ];

  const playgroundCards = [
    {
      id: 1,
      title: "Hyundai Sales AI",
      description:
        "Personalized car buying assistant with budget checks and inventory emails",
      gradient: "from-indigo-700 via-sky-600 to-emerald-500",
      icon: <Bot className="w-8 h-8" />,
      stats: { accuracy: "94.9%", speed: "1.6s", models: "GPT-4.1" },
      category: "AI Sales Assistant",
      Link: "http://13.202.236.112:5175/",
      isNew: false,
    },
    {
      id: 2,
      title: "Nova",
      description:
        "Chatbot-powered movie suggestions and real-time ticket booking",
      gradient: "from-violet-700 via-purple-600 to-blue-600",
      icon: <Bot className="w-8 h-8" />,
      stats: { accuracy: "87.9%", speed: "1.6s", models: "GPT-4.1" },
      category: "AI Entertainment Assistant",
      Link: "http://13.202.236.112:5176/",
      isNew: false,
    },
    {
      id: 3,
      title: "KnowledgeWeaver",
      description:
        "Transforms unstructured data into a queryable knowledge graph",
      gradient: "from-purple-800 via-fuchsia-700 to-rose-600",
      icon: <BookOpen className="w-8 h-8" />,
      stats: { accuracy: "90.4%", speed: "2.1s", models: "GPT-4.1" },
      category: "Knowledge Intelligence",
      Link: "http://13.202.236.112:5170/",
      isNew: false,
    },
  ];

  const createParticles = () => {
    const particlesContainer = document.getElementById("particles");
    if (!particlesContainer) return;

    particlesContainer.innerHTML = "";

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full animate-float";

      const particleTypes = [
        "w-1 h-1 bg-blue-400/30",
        "w-2 h-2 bg-purple-400/20",
        "w-1.5 h-1.5 bg-cyan-400/25",
        "w-0.5 h-0.5 bg-pink-400/40",
      ];

      particle.className +=
        " " + particleTypes[Math.floor(Math.random() * particleTypes.length)];
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 20 + "s";
      particle.style.animationDuration = 15 + Math.random() * 10 + "s";
      particlesContainer.appendChild(particle);
    }
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  useEffect(() => {
    createParticles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white overflow-hidden relative">
      {/* Enhanced Floating Particles */}
      <div
        id="particles"
        className="fixed inset-0 pointer-events-none z-0"
      ></div>

      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Enhanced Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 mb-8">
          {/* Header Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/10 to-pink-600/5"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 px-6 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Top Row - Branding and Actions */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  {/* Logo and Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                      <Wand2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Model Playground
                      </h1>
                      <p className="text-slate-400 text-sm font-medium">
                        Discover, Test & Deploy AI Models
                      </p>
                    </div>
                  </div>

                  {/* Live Status Badge */}
                  <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full border border-emerald-500/30">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-300">
                      3 Models Live
                    </span>
                  </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-slate-300">
                      Analytics
                    </span>
                  </div>

                  <button className="p-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all duration-200 hover:scale-105">
                    <Bell className="w-5 h-5" />
                  </button>

                  <button className="p-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all duration-200 hover:scale-105">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2.5 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white transition-all duration-200"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  {showMobileMenu ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Enhanced Search Section */}
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-lg"></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-1.5">
                    <div className="flex items-center gap-3">
                      <Search className="absolute left-5 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search models by name, category, or capability..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 pl-14 pr-4 py-4 bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className={`p-3 rounded-xl transition-all duration-200 ${
                            showFilters
                              ? "bg-blue-600/20 border-blue-500/30 text-blue-400"
                              : "bg-slate-700/50 border-slate-600/50 text-slate-400 hover:text-white"
                          } border hover:scale-105`}
                        >
                          <Filter className="w-4 h-4" />
                        </button>

                        <div className="flex bg-slate-700/50 rounded-xl p-1 border border-slate-600/50">
                          <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2.5 rounded-lg transition-all duration-200 ${
                              viewMode === "grid"
                                ? "bg-blue-600/20 text-blue-400"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <Grid3X3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewMode("list")}
                            className={`p-2.5 rounded-lg transition-all duration-200 ${
                              viewMode === "list"
                                ? "bg-blue-600/20 text-blue-400"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <List className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={handleSearch}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
                        >
                          <Rocket className="w-4 h-4" />
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Tags */}
                {showFilters && (
                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 animate-fade-in">
                    <div className="flex flex-wrap gap-3">
                      {filters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setActiveFilter(filter.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                            activeFilter === filter.id
                              ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/25"
                              : "bg-slate-700/30 border-slate-600/30 text-slate-400 hover:text-white hover:bg-slate-700/50"
                          } border`}
                        >
                          {filter.icon}
                          <span>{filter.label}</span>
                          <span className="px-2 py-1 bg-slate-600/50 rounded-full text-xs font-bold">
                            {filter.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-slate-400">
                        Total Models
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-xs text-emerald-400 font-medium">
                      + this week
                    </div>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-medium text-slate-400">
                        Trending
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-xs text-emerald-400 font-medium">
                      Hot right now
                    </div>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <span className="text-sm font-medium text-slate-400">
                        Verified
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-xs text-purple-400 font-medium">
                      Quality assured
                    </div>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium text-slate-400">
                        Active
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-xs text-yellow-400 font-medium">
                      Running now
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Menu */}
              {showMobileMenu && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-6 z-50">
                  <div className="space-y-4">
                    <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold">
                      <Plus className="w-5 h-5" />
                      Create Model
                    </button>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="flex flex-col items-center gap-2 p-4 bg-slate-800/30 rounded-xl text-slate-400 hover:text-white transition-all duration-200">
                        <Bell className="w-5 h-5" />
                        <span className="text-xs font-medium">
                          Notifications
                        </span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 bg-slate-800/30 rounded-xl text-slate-400 hover:text-white transition-all duration-200">
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-xs font-medium">Analytics</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 bg-slate-800/30 rounded-xl text-slate-400 hover:text-white transition-all duration-200">
                        <Settings className="w-5 h-5" />
                        <span className="text-xs font-medium">Settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Enhanced Cards Grid with Uniform Sizing */}
        <div className="px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {playgroundCards.map((card) => (
                <NavLink to={card.Link}>
                  <div
                    key={card.id}
                    className="group relative h-[480px] w-full" // Fixed height for uniform sizing
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Card Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 scale-105`}
                    ></div>

                    {/* Main Card */}
                    <div className="relative h-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-slate-600/50 transition-all duration-500 cursor-pointer overflow-hidden group-hover:scale-105 flex flex-col">
                      {/* Card Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      </div>

                      {/* Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="px-3 py-1 bg-slate-800/50 rounded-full text-xs font-medium text-slate-300 border border-slate-700/50">
                          {card.category}
                        </span>
                        {card.isNew && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full border border-emerald-500/30">
                            <Star className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-300">
                              New
                            </span>
                          </div>
                        )}
                        {card.isHot && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30">
                            <Zap className="w-3 h-3 text-orange-400" />
                            <span className="text-xs font-medium text-orange-300">
                              Hot
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className="text-white">{card.icon}</div>
                      </div>

                      {/* Content - Flexible height */}
                      <div className="flex-1 flex flex-col mb-6">
                        <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300 mb-4">
                          {card.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed flex-1 text-sm">
                          {card.description}
                        </p>
                      </div>

                      {/* Stats - Fixed position */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {Object.entries(card.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-sm font-semibold text-white">
                              {value}
                            </div>
                            <div className="text-xs text-slate-400 capitalize">
                              {key}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Button - Fixed at bottom */}
                      <button className="w-full py-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-blue-600/50 hover:to-purple-600/50 rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105">
                        <span>Launch Model</span>

                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </button>
                      {/* Hover Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500`}
                      ></div>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>

            {/* Load More Section */}
            <div className="text-center mt-16">
              <button className="px-12 py-4 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-white font-medium transition-all duration-200 hover:scale-105 hover:border-blue-500/50 hover:text-blue-400 flex items-center gap-3 mx-auto">
                <Plus className="w-5 h-5" />
                Load More Models
              </button>
            </div>
          </div>
        </div>
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
          animation: float 25s infinite linear;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Studio;
