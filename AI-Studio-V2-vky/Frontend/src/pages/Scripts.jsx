import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Package, Code2, Filter, X, ChevronDown, Check, Star, TrendingUp, Zap, Crown, Sparkles  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScriptViewerModal from "../components/ScriptViewerModal";
import { scriptCategories } from "../data/scriptStructures";
import{
  ScrollText 
} from 'lucide-react'
const Scripts = () => {
  const [activeCategory, setActiveCategory] = useState("featured");
  const [activeTier, setActiveTier] = useState("all");
  const [selectedScript, setSelectedScript] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Extract unique languages from all scripts
  const availableLanguages = useMemo(() => {
    const languages = new Set();
    scriptCategories.forEach(cat => {
      cat.scripts.forEach(script => {
        if (script.language) languages.add(script.language);
      });
    });
    return Array.from(languages).sort();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allScripts = scriptCategories.flatMap(cat =>
    cat.scripts.map(script => ({ ...script, category: cat.name }))
  );

  const filteredScripts = useMemo(() => {
    return allScripts.filter(script => {
      const matchesCategory =
        activeCategory === "featured"
          ? script.featured === true
          : script.category === activeCategory;

      const matchesSearch =
        script.title.toLowerCase().includes(search.toLowerCase()) ||
        script.description.toLowerCase().includes(search.toLowerCase()) ||
        script.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));

      const matchesLanguage =
        selectedLanguages.length === 0 ||
        selectedLanguages.includes(script.language);

      const matchesTier =
        activeTier === "all" || script.tier === activeTier;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesLanguage &&
        matchesTier
      );
    });
  }, [allScripts, activeCategory, search, selectedLanguages, activeTier]);



  // Toggle language filter
  const toggleLanguage = (language) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(lang => lang !== language)
        : [...prev, language]
    );
  };

  // Clear all filters
const clearAllFilters = () => {
  setSearch("");
  setSelectedLanguages([]);
  setActiveCategory("featured");
  setActiveTier("all");   // 🔥 this was missing
};

  // Get language badge color
  const getLanguageColor = (language) => {
    const colors = {
      Python: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      JavaScript: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
      TypeScript: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    };
    return colors[language] || "bg-gray-500/20 text-gray-400 border-gray-500/40";
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "bg-green-500/20 text-green-400",
      Medium: "bg-yellow-500/20 text-yellow-400",
      Hard: "bg-red-500/20 text-red-400",
    };
    return colors[difficulty] || "bg-gray-500/20 text-gray-400";
  };

const hasActiveFilters =
  selectedLanguages.length > 0 ||
  search ||
  activeTier !== "all" ||
  activeCategory !== "featured";

 const featuredScripts = allScripts.filter(s => s.featured);
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
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 8 + "s",
              animationDuration: 8 + Math.random() * 4 + "s"
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <ScrollText  className="w-8 h-8 text-blue-400" />
              Script Marketplace
            </h1>
            <p className="text-white/60 text-lg">
               Reusable production-ready scripts for real-world projects
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <span className="text-sm text-blue-300">
                {allScripts.length} Scripts available
              </span>
            </div>
          </div>
        </div>

        <hr className="p-2"/>

        {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-5 h-5 text-blue-400" />
                <TrendingUp className="w-4 h-4 text-blue-400/50" />
              </div>
              <div className="text-2xl font-bold text-blue-400">{allScripts.length}</div>
              <div className="text-sm text-white/60">Total Scripts</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-5 h-5 text-purple-400" />
                <Sparkles className="w-4 h-4 text-purple-400/50" />
              </div>
              <div className="text-2xl font-bold text-purple-400">{featuredScripts.length}</div>
              <div className="text-sm text-white/60">Featured</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-green-400" />
                <TrendingUp className="w-4 h-4 text-green-400/50" />
              </div>
              <div className="text-2xl font-bold text-green-400">{allScripts.filter(s => s.tier === 'free').length}</div>
              <div className="text-sm text-white/60">Zero Cost Scripts</div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Crown className="w-5 h-5 text-pink-400" />
                <Sparkles className="w-4 h-4 text-pink-400/50" />
              </div>
              <div className="text-2xl font-bold text-pink-400">{featuredScripts.length}</div>
              <div className="text-sm text-white/60">Nexus Picks</div>
            </div>
          </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-3 mb-6 flex-col sm:flex-row">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-white/40" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Search by title, description, or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 text-white/40 hover:text-white/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Language Dropdown Filter */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
              selectedLanguages.length > 0
                ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                : "bg-white/5 text-white/80 border-white/10 hover:border-white/20 hover:bg-white/10"
            }`}
          >
            <Code2 className="w-5 h-5" />
            <span className="font-medium">
              {selectedLanguages.length > 0
                ? `${selectedLanguages.length} Language${selectedLanguages.length > 1 ? 's' : ''}`
                : "Language"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-56 bg-slate-800 border border-white/10 rounded-lg shadow-2xl shadow-black/50 overflow-hidden z-50">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-white/60 uppercase">
                  Select Languages
                </div>

                {availableLanguages.map((language) => {
                  const isSelected = selectedLanguages.includes(language);
                  return (
                    <button
                      key={language}
                      onClick={() => toggleLanguage(language)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                        isSelected
                          ? "bg-blue-500/20 text-blue-400"
                          : "text-white/80 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-blue-500 border-blue-500"
                              : "border-white/20"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="font-medium">{language}</span>
                      </div>
                      <span className="text-xs text-white/40">
                        {allScripts.filter(s => s.language === language).length}
                      </span>
                    </button>
                  );
                })}

                {selectedLanguages.length > 0 && (
                  <>
                    <div className="my-2 border-t border-white/10" />
                    <button
                      onClick={() => {
                        setSelectedLanguages([]);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                    >
                      Clear Selection
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

          <div className="flex gap-2">
            {[
              {
                key: "free",
                label: "FREE",
                help: "No paid APIs required.",
                icon: Zap
              },
              {
                key: "pro",
                label: "PRO",
                help: "Uses paid AI models like OpenAI, Claude, or Groq.",
                icon: Star
              },
              {
                key: "best",
                label: "IN USE",
                help: "One of the scripts used in our own products",
                icon: Crown
              }
            ].map(tier => (
              <div key={tier.key} className="relative group">
                <button
                  onClick={() =>
                      setActiveTier(prev => (prev === tier.key ? "all" : tier.key))
                    }

                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all backdrop-blur-sm flex items-center gap-2 ${
                    activeTier === tier.key
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/40"
                      : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
                  }`}
                >
                  <tier.icon className="w-4 h-4" />
                  {tier.label}
                </button>

                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white/80 text-xs rounded-lg px-3 py-2 shadow-xl">
                    {tier.help}
                  </div>
                </div>
              </div>
            ))}
          </div>



        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2 font-medium"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        )}
      </div>

      {/* Active Language Filters Pills */}
      {selectedLanguages.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {selectedLanguages.map((language) => (
            <div
              key={language}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getLanguageColor(
                language
              )}`}
            >
              <span className="text-sm font-medium">{language}</span>
              <button
                onClick={() => toggleLanguage(language)}
                className="hover:bg-white/10 rounded p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

        {/* Categories with Modern Design */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveCategory("featured")}
            className={`px-5 py-2.5 rounded-xl transition-all text-sm font-semibold backdrop-blur-sm flex items-center gap-2 ${
              activeCategory === "featured"
                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-2 border-blue-500/40 shadow-lg shadow-blue-500/20"
                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-2 border-transparent"
            }`}
          >
            <Star className="w-4 h-4" />
            Featured
          </button>

          {scriptCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-5 py-2.5 rounded-xl transition-all text-sm font-semibold backdrop-blur-sm ${
                activeCategory === cat.name
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-2 border-blue-500/40 shadow-lg shadow-blue-500/20"
                  : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-2 border-transparent"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Header with Animation */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-white/60">
            Showing <span className="text-white font-bold text-lg">{filteredScripts.length}</span> of{" "}
            <span className="text-white/80">{allScripts.length}</span> script
            {filteredScripts.length !== 1 ? "s" : ""}
          </p>
          
          {activeCategory === "featured" && (
            <div className="flex items-center gap-2 text-sm text-purple-400 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Handpicked by NEXUS</span>
            </div>
          )}
        </div>

      {/* Results Header */}
      {/* <div className="mb-4">
        <p className="text-sm text-white/60">
          Showing <span className="text-white font-semibold">{filteredScripts.length}</span> of{" "}
          <span className="text-white/80">{allScripts.length}</span> script
          {filteredScripts.length !== 1 ? "s" : ""}
        </p>
      </div> */}

      {/* Scripts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScripts.length > 0 ? (
          filteredScripts.map(script => (
            <div
              key={script.id}
              onClick={() => setSelectedScript(script)}
              className="cursor-pointer bg-white/5 border border-white/10 rounded-xl p-5 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 group"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-white flex items-center gap-2 line-clamp-2 group-hover:text-blue-400">
                {script.title}

                {script.tier === "best" && (
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                    Nexus Pick
                  </span>
                )}
              </h3>

                <Package className="w-4 h-4 text-blue-400 flex-shrink-0 ml-2" />
              </div>

    {/* Language & Difficulty Badges */}
    {/* Badges */}
    <div className="flex gap-2 mb-3 flex-wrap items-center">
      {/* Tier */}
      {script.tier && (
        <span
          className={`text-xs px-2.5 py-1 rounded-md font-semibold border
          ${
            script.tier === "free"
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : script.tier === "pro"
              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
              : "bg-purple-500/10 text-purple-400 border-purple-500/30"
          }`}
        >
          {script.tier.toUpperCase()}
        </span>
      )}

          {/* Language */}
          {script.language && (
            <span
              className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md border font-semibold ${getLanguageColor(
                script.language
              )}`}
            >
              {script.language}
            </span>
          )}

        {/* Difficulty */}
        {script.difficulty && (
          <span
            className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md font-semibold ${getDifficultyColor(
              script.difficulty
            )}`}
          >
            {script.difficulty}
          </span>
        )}
      </div>


              {/* Description */}
              <p className="text-sm text-white/60 mb-3 line-clamp-2">
                {script.description}
              </p>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap mb-3">
                {script.tags?.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {script.tags?.length > 3 && (
                  <span className="text-xs text-white/40 px-2 py-1 font-medium">
                    +{script.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Model + Cost */}
              <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                <div className="flex gap-2 flex-wrap">
                  {script.models?.slice(0, 2).map(m => (
                    <span key={m} className="px-2 py-1 bg-black/40 rounded">
                      {m}
                    </span>
                  ))}
                </div>

                {script.cost && (
                  <span className="text-white/60 font-medium">
                    Cost: {script.cost}
                  </span>
                )}
              </div>

              {/* Category Footer */}
              <div className="pt-3 border-t border-white/10">
                <span className="text-xs text-white/40 font-medium">
                  {script.category}
                </span>
              </div>
            </div>
          ))
        ) : (
          // Empty State
          <div className="col-span-full text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-4">
              <Package className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No scripts found</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Try adjusting your filters or search query to find what you're looking for
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Script Viewer Modal */}
      {selectedScript && (
        <ScriptViewerModal
          script={selectedScript}
          onClose={() => setSelectedScript(null)}
        />
      )}
    </div>
  );
};

export default Scripts;