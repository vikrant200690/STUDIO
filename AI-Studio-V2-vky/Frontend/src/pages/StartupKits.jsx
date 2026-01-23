import React, { useState } from 'react';
import {
  Search,
  Star,
  Clock,
  XCircle,
  Package,
  Layout,
  Layers,
  Brain,
  Server,
  GitBranch,
  Database,
  Code,
  Palette,
  Cog,
  Globe,
  Smartphone,
  BriefcaseBusiness ,
  Sparkles,
} from "lucide-react";
import { kitStructures } from '../data/kitStructures';
import FolderStructureViewer from '../components/FolderStructureViewer';
import StartupKitQuiz from '../components/StartupKitQuiz';
import OpenInSandbox from '../components/OpenInSandbox';

const StartupKits = () => {
  const [activeCategory, setActiveCategory] = useState("featured");
  const [selectedKit, setSelectedKit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  const calculateMatchScore = (kit, answers) => {
    if (!answers || !kit?.recommendedFor) return 0;

    let score = 0;
    const rf = kit.recommendedFor;

    if (rf.product?.includes(answers.product)) score += 25;
    if (rf.experience?.includes(answers.level)) score += 20;
    if (rf.team?.includes(answers.team)) score += 10;
    if (rf.timeline?.includes(answers.timeline)) score += 15;
    if (rf.priorities?.includes(answers.priority)) score += 15;

    answers.tech?.forEach((tech) => {
      if (rf.tech?.includes(tech)) score += 5;
    });

    return Math.min(score, 100);
  };


  const getRecommendedTemplates = (answers) => {
  return templates
    .map((kit) => ({
      ...kit,
      matchScore: calculateMatchScore(kit, answers),
    }))
    .filter((kit) => kit.matchScore > 20)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
    };

  const categories = [
    { id: "featured", name: "Featured", icon: <Package className="w-4 h-4"/> },
    { id: "Frontend", name: "Frontend", icon: <Layout className="w-4 h-4"/> },
    { id: "Backend", name: "Backend", icon: <Server className="w-4 h-4"/> },
    { id: "AI/ML", name: "AI/ML", icon: <Brain className="w-4 h-4"/> },
    { id: "Full Stack", name: "Full Stack", icon: <Layers className="w-4 h-4"/> },
    { id: "CI/CD", name: "CI/CD", icon: <GitBranch className="w-4 h-4"/> },
    // { id: "Migrations", name: "Migrations", icon: <GitBranch className="w-4 h-4"/>}
  ];

  const iconMap = {
    Brain: <Brain className="w-6 h-6" />,
    Layout: <Layout className="w-6 h-6" />,
    GitBranch: <GitBranch className="w-6 h-6" />,
    Server: <Server className="w-6 h-6" />,
    Layers: <Layers className="w-6 h-6" />,
    Database: <Database className="w-6 h-6" />,
    Code: <Code className="w-6 h-6" />,
    Palette: <Palette className="w-6 h-6" />,
    Cog: <Cog className="w-6 h-6" />,
    Smartphone: <Smartphone className="w-6 h-6" />,
  };

const kitMeta = {
  1: {
    category: "Frontend",
    icon: "Layout",
    rating: 4.7,
    setupTime: "10 min",
    status: "Ready",
    tags: ["React", "Vite", "Frontend"],
  },
  2: {
    category: "Backend",
    icon: "Server",
    rating: 4.8,
    setupTime: "12 min",
    status: "Ready",
    tags: ["FastAPI", "Python", "AI"],
  },
  3: {
    category: "AI/ML",
    icon: "Brain",
    rating: 4.9,
    setupTime: "15 min",
    status: "Beta",
    tags: ["RAG", "LLM", "Vector DB"],
  },
  4: {
    category: "Backend",
    icon: "Database",
    rating: 4.6,
    setupTime: "10 min",
    status: "Ready",
    tags: ["Django", "Backend"],
  },
  5: {
    category: "Backend",
    icon: "Server",
    rating: 4.7,
    setupTime: "8 min",
    status: "Ready",
    tags: ["Node.js", "Express"],
  },
  7: {
    category: "Full Stack",
    icon: "Layers",
    rating: 4.9,
    setupTime: "15 min",
    status: "Ready",
    tags: ["Next.js", "Fullstack"],
  },
  8: {
    category: "Frontend",
    icon: "Palette",
    rating: 4.6,
    setupTime: "9 min",
    status: "Ready",
    tags: ["Vue", "Frontend"],
  },
  9: {
    category: "Backend",
    icon: "Cog",
    rating: 4.7,
    setupTime: "15 min",
    status: "Ready",
    tags: ["Spring Boot", "Java"],
  },
  10: {
    category: "Frontend",
    icon: "Smartphone",
    rating: 4.5,
    setupTime: "12 min",
    status: "Beta",
    tags: ["React Native", "Mobile"],
  },
  11: {
    category: "CI/CD",
    icon: "GitBranch",
    rating: 4.9,
    setupTime: "20 min",
    status: "Ready",
    tags: ["CI/CD", "DevOps"],
  },
};

const templates = Object.entries(kitStructures).map(([id, kit]) => ({
  id: Number(id),
  name: kit.name,
  description: kit.description,
  featured: kit.featured || false,
  // ⭐ bring recommendation metadata
  recommendedFor: kit.recommendedFor,
  useCases: kit.useCases,
  skillLevel: kit.skillLevel,

  ...kitMeta[id],
}));


  // Filter templates by category and search
const filteredTemplates = templates.filter(template => {
  // Logic for the Featured Tab vs Category Tabs
  const matchesCategory = 
    activeCategory === "featured" 
      ? template.featured === true  // Only show featured kits in Featured tab
      : template.category === activeCategory; // Show by category in other tabs

  const matchesSearch = 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

  return matchesCategory && matchesSearch;
});

  const handleViewKit = (template) => {
    const kitData = kitStructures[template.id];
    if (kitData) {
      setSelectedKit(kitData);
    } else {
      console.error(`No structure found for kit ID: ${template.id}`);
    }
  };

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
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <BriefcaseBusiness className="w-8 h-8 text-blue-400" />
              Startup Kits | Project Templates
            </h1>
            <p className="text-white/60 text-lg">
              Production-Grade Project Starters for Modern Tech Stacks
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Live Browser Support Badge */}
            <div className="px-1 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2">
              {/* <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> */}
              <span className="text-sm text-emerald-300 font-medium">
                Browser Preview Enabled
              </span>
            </div>
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <span className="text-sm text-blue-300">
                {templates.length} Templates available
              </span>
            </div>
          </div>
        </div>

      <hr className="p-2"/>

      {/* Startup Kit Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">

        {/* Frontend */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <Layout className="w-5 h-5 text-blue-400" />
            <Sparkles className="w-4 h-4 text-blue-400/50" />
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {templates.filter(t => t.category === "Frontend").length}
          </div>
          <div className="text-sm text-white/60">Frontend Kits</div>
        </div>

        {/* Backend */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <Server className="w-5 h-5 text-green-400" />
            <Sparkles className="w-4 h-4 text-green-400/50" />
          </div>
          <div className="text-2xl font-bold text-green-400">
            {templates.filter(t => t.category === "Backend").length}
          </div>
          <div className="text-sm text-white/60">Backend Kits</div>
        </div>

        {/* AI / ML */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <Sparkles className="w-4 h-4 text-purple-400/50" />
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {templates.filter(t => t.category === "AI/ML").length}
          </div>
          <div className="text-sm text-white/60">AI / ML Kits</div>
        </div>

        {/* Full Stack */}
        <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <Layers className="w-5 h-5 text-pink-400" />
            <Sparkles className="w-4 h-4 text-pink-400/50" />
          </div>
          <div className="text-2xl font-bold text-pink-400">
            {templates.filter(t => t.category === "Full Stack").length}
          </div>
          <div className="text-sm text-white/60">Full-Stack Kits</div>
        </div>

      </div>

        {/* Search */}
        {/* <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search templates by name, description, or tags..."
              className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div> */}

        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Find the Right Startup Kit for Your Build</h2>
          <p className="text-white/70">
          Quick questions. Smart matching. Production-ready startup templates.</p>
        </div>
        <button
          onClick={() => setShowQuiz(true)}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold shadow-lg"
        >
          🎯 Find My Perfect Kit
        </button>
        </div>
        
        {showQuiz && (
        <StartupKitQuiz
            onClose={() => setShowQuiz(false)}
            onComplete={(answers) => {
              setShowQuiz(false);
              setQuizResults(answers); // Next: feed this into recommendation engine
            }}
          />
        )}

        {quizResults && (
  <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30">
    
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🎯 Recommended for You
        </h2>
        <p className="text-white/70 mt-1">
          Based on your goals, experience, and tech preferences
        </p>
      </div>

      <button
        onClick={() => setQuizResults(null)}
        className="text-sm text-white/60 hover:text-white"
      >
        Clear recommendations
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {getRecommendedTemplates(quizResults).map((kit) => (
        <div
          key={kit.id}
          className="bg-slate-900/70 border border-white/10 rounded-xl p-5 hover:border-blue-400/50 transition-all"
        >
          {/* Match Badge */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-500/20 text-green-400">
              {kit.matchScore}% Match
            </span>
            <span className="text-xs text-white/50">
              Best fit
            </span>
          </div>

          <h3 className="text-lg font-semibold mb-2">
            {kit.name}
          </h3>

          <p className="text-sm text-white/60 mb-4 line-clamp-3">
            {kit.description}
          </p>

          {/* Why Recommended */}
          <div className="mb-4">
            <p className="text-xs uppercase text-white/40 mb-1">
              Why this fits
            </p>
            <ul className="text-sm text-white/70 space-y-1">
              {kit.useCases?.slice(0, 2).map((use, i) => (
                <li key={i}>• {use}</li>
              ))}
              <li>• {kit.skillLevel}</li>
            </ul>
          </div>

          <button
            onClick={() => handleViewKit(kit)}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all font-semibold"
          >
            View Structure →
          </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {quizResults && getRecommendedTemplates(quizResults).length === 0 && (
        <p className="text-white/60 p-3.5">
          No strong matches found — try adjusting your preferences.
        </p>
      )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className='mb-4'>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            {activeCategory === "all" 
              ? "All Templates" 
              : categories.find(c => c.id === activeCategory)?.name}
            <span className="text-white/40">({filteredTemplates.length})</span>
          </h2>
          {searchQuery && (
            <p className="text-white/60 text-sm">
              Showing results for: <span className="text-blue-400 font-semibold">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/40 transition-all group hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  {iconMap[template.icon]}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  template.status === "Ready"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                }`}>
                  {template.status}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-white/60 mb-4 line-clamp-3">
                {template.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {template.tags.slice(0, 3).map((tag, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-1 bg-blue-500/10 text-blue-300 rounded-md border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-white/5 text-white/40 rounded-md">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-white/60 mb-4 pb-4 border-b border-white/10">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 
                  {template.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 
                  {template.setupTime}
                </span>
              </div>

              {/* CTA */}
              <div className="mt-auto">
                <button 
                  onClick={() => handleViewKit(template)}
                  className="w-full py-2.5 rounded-lg 
                            bg-gradient-to-r from-blue-600/20 to-purple-600/20 
                            hover:from-blue-600 hover:to-purple-600 
                            text-blue-300 hover:text-white transition-all 
                            flex items-center justify-center gap-2 font-medium 
                            border border-blue-500/30 hover:border-blue-500 
                            group-hover:shadow-lg group-hover:shadow-blue-500/30">
                  View Structure
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <div className="mt-3">
                  <OpenInSandbox github={kitStructures[template.id]?.githublink} />
                </div>
              </div>


            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <XCircle className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-2">No templates found</p>
            <p className="text-white/40 text-sm mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("featured");
              }}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Folder Structure Modal */}
      {selectedKit && (
        <FolderStructureViewer
          structure={selectedKit}
          onClose={() => setSelectedKit(null)}
        />
      )}
    </div>
  );
};

export default StartupKits;