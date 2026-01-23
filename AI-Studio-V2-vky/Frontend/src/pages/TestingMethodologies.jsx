// TestingMethodologies.jsx - Updated with TDD Lab Integration

import React, { useState, useCallback, useMemo, useTransition } from "react"
import { useNavigate } from "react-router-dom"
import { BriefcaseBusiness, Search, Play,Book, FileCode, Zap, TrendingUp, BookOpen, GitBranch, Users, Star, Filter, HandHelping } from "lucide-react"
import { testingMethods } from "../data/testingMethodsData"
import TestingMethodModal from "../components/TestingMethodModal"
import TDDLabModal from "../components/TDDLabModal" // Import the new component
import TDDGuide from "../components/TDDGuide"
import BDDGuide from "../components/BDDGuide"
import ToolMatrix from "../components/ToolMatrix"

const TestingMethodologies = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isPending, startTransition] = useTransition()
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showTDDGuide, setShowTDDGuide] = useState(false);
  const [showBDDGuide, setShowBDDGuide] = useState(false);
  const [showTDDLab, setShowTDDLab] = useState(false);
  // const [showToolMatrix, setShowToolMatrix] = useState(false);

  const filteredMethods = useMemo(() => {
    let filtered = testingMethods

    if (searchTerm) {
      filtered = filtered.filter((method) =>
        [method.title, method.shortDescription, method.description, method.whenToUse]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    }

    if (selectedFilter !== "all") {
      filtered = filtered.filter((method) => 
        method.level.toLowerCase() === selectedFilter.toLowerCase()
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((method) => 
        method.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    return filtered
  }, [searchTerm, selectedFilter, selectedCategory])

  const handleCardClick = useCallback((method) => {
    startTransition(() => {
      setSelectedMethod(method)
    })
  }, [])

  const handleSearch = useCallback((e) => {
    startTransition(() => {
      setSearchTerm(e.target.value)
    })
  }, [])

  const stats = [
    { label: "Testing Methods", value: testingMethods.length, icon: BriefcaseBusiness },
    { label: "Quick Templates", value: "24+", icon: FileCode },
    // { label: "CI/CD Configs", value: "12+", icon: GitBranch },
    { label: "Tool Guides", value: "3+", icon: Zap }
  ]

  const filters = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" }
  ]

  const handleToolMatrix =() =>{
    navigate("/toolmatrix");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6">
      
      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <BriefcaseBusiness className="w-8 h-8 text-blue-400" />
              Testing Methodologies
            </h1>
            <p className="text-white/60 text-lg">
              Production-ready testing strategies, templates, and workflows used by real engineering teams.
            </p>
          </div>
        </div>
      </div>

      <hr />

      {/* Quick Stats */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-white/60">{stat.label}</p>
          </div>
        ))}
      </div> */}

      {/* Quick Access Tabs - UPDATED: Add onClick to TDD/BDD button */}
      <div className="mb-8 mt-4 overflow-x-auto">
        <div className="flex gap-3 pb-2">
          <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold whitespace-nowrap flex items-center gap-2 shadow-lg">
            <Star className="w-4 h-4" />
            Templates
          </button>

          <button
            onClick={() => setShowTDDGuide(true)}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition whitespace-nowrap flex items-center gap-2"
          >
            <Book className="w-4 h-4" />
            TDD Guide
          </button>

          <button onClick={() => setShowBDDGuide(true)} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-2">
            <Book className="w-4 h-4" />
            BDD Guide
            </button>

          {/* UPDATED: Add onClick handler to open TDD Lab */}
          <button 
            onClick={() => setShowTDDLab(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-red-700 text-white font-semibold whitespace-nowrap flex items-center gap-2 shadow-lg transition-all"
          >
            <BookOpen className="w-4 h-4" />
            TDD Interactive Lab
            <span className="px-2 py-0.5 bg-white/20 rounded text-xs">NEW</span>
          </button>

          <button
          // onClick={()=> setShowToolMatrix(true)}
          onClick={handleToolMatrix}
           className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition whitespace-nowrap flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Tool Matrix
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="max-w-4xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by testing type, use case, or workflow..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-lg"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-5 h-5 text-white/60" />
          <span className="text-sm text-white/60 font-semibold">Filter by:</span>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                selectedFilter === filter.id
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
              }`}
            >
              {filter.label}
            </button>
          ))}
          {selectedFilter !== "all" && (
            <button
              onClick={() => setSelectedFilter("all")}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Section Header with Count */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white/90 flex items-center gap-2">
          <span className="text-3xl">🚀</span>
          Quick Start Testing Templates
          <span className="text-lg text-white/40 font-normal ml-2">
            ({filteredMethods.length} {filteredMethods.length === 1 ? 'template' : 'templates'})
          </span>
        </h2>
        
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-blue-600 text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8-8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredMethods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredMethods.map((method) => (
            <div
              key={method.id}
              className="group bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-blue-500/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(method)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <h3 className="text-2xl font-bold text-blue-300 mb-2 relative z-10 group-hover:text-blue-200 transition">
                {method.title}
              </h3>

              <p className="text-sm text-white/60 mb-4 relative z-10 line-clamp-2">
                {method.whenToUse}
              </p>

              <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-700/60 border border-white/5">
                  {method.level}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/20">
                  {method.speed}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/20">
                  {method.owner}
                </span>
              </div>

              <div className="flex gap-3 relative z-10">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/40 hover:bg-blue-600/60 text-sm font-semibold transition border border-blue-500/30"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick(method)
                  }}
                >
                  <FileCode className="w-4 h-4" />
                  Use Template
                </button>

                <button
                  className="flex items-center justify-center px-3 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 transition"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick(method)
                  }}
                  title="View Details"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white/70 mb-2">No templates found</h3>
          <p className="text-white/50">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm("")
              setSelectedFilter("all")
            }}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Modals */}
      <TestingMethodModal
        method={selectedMethod}
        isOpen={!!selectedMethod}
        onClose={() => setSelectedMethod(null)}
      />
      
      {/* NEW: Add TDD Lab Modal */}
      <TDDLabModal
        isOpen={showTDDLab}
        onClose={() => setShowTDDLab(false)}
      />

    {showTDDGuide && (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-6">
        <div className="bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl relative">
      
            {/* Close button */}
            <button
              onClick={() => setShowTDDGuide(false)}
              className="absolute top-5 right-5 text-white/60 hover:text-white"
            >
              ✕
            </button>

            {/* TDD Guide */}
            <TDDGuide
              onStartLab={() => {
                setShowTDDGuide(false)
                setShowTDDLab(true)
              }}
              />
        </div>
      </div>
    )}

      {showBDDGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-6">
          <div className="bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl relative">
            <button
              onClick={() => setShowBDDGuide(false)}
              className="absolute top-5 right-5 text-white/60 hover:text-white"
            >
              ✕
            </button>

            <BDDGuide />
          </div>
        </div>
      )}

      {/* {showToolMatrix && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-6">
          <div className="bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl relative">
              <button
              onClick={() => setShowToolMatrix(false)}
              className="absolute top-5 right-5 text-white/60 hover:text-white"
            >x</button>
            <ToolMatrix/></div>
        </div>
      )
      } */}

  

    </div>
  )
}

export default TestingMethodologies;