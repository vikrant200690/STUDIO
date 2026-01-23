import React, { useEffect, useRef, useState } from "react"
import { X, Copy, Check } from "lucide-react"

const tabs = ["Overview", "Code", "Practices", "CI/CD", "Real World"]

const TestingMethodModal = ({ method, onClose, isOpen }) => {
  const contentRef = useRef(null)
  const [activeTab, setActiveTab] = useState("Overview")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      contentRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!method || !isOpen) return null

  const handleCopy = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className="bg-slate-900 max-w-7xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl p-8 relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/60 hover:text-white"
        >
          <X />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            {method.title}
          </h2>
          <div className="flex gap-2 flex-wrap">
            <span className="badge">{method.level}</span>
            <span className="badge">{method.speed}</span>
            <span className="badge">{method.owner}</span>
            <span className="badge">{method.category}</span>
          </div>
        </div>

        {/* 🚀 Quick Start */}
        {method.quickStartTemplate && (
          <section className="mb-8 bg-slate-800/60 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-green-400">
                🚀 Quick Start Template
              </h3>
              <button
                onClick={() => handleCopy(method.quickStartTemplate.code)}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-green-300 overflow-x-auto">
              <code>{method.quickStartTemplate.code}</code>
            </pre>
          </section>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold transition ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {activeTab === "Overview" && (
          <>
            <p className="text-white/70 mb-6">{method.description}</p>

            <h4 className="font-semibold mb-3">When to Use</h4>
            <ul className="list-disc pl-6 space-y-2 text-white/80 mb-6">
              {method.whenToUse.map((w, i) => <li key={i}>{w}</li>)}
            </ul>

            <h4 className="font-semibold mb-3">Tools</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {method.tools.map((tool, i) => (
                <div
                  key={i}
                  className="bg-slate-800/60 p-3 rounded-lg border border-white/10"
                >
                  <p className="font-medium text-blue-300">{tool.name}</p>
                  <p className="text-sm text-white/60">{tool.useCase}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Code" && method.codeExample && (
          <>
            <h4 className="font-semibold mb-3">{method.codeExample.title}</h4>
            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-blue-300 overflow-x-auto">
              <code>{method.codeExample.code}</code>
            </pre>
          </>
        )}

        {activeTab === "Practices" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Best Practices</h4>
              <ul className="list-disc pl-6 space-y-2 text-white/80">
                {method.bestPractices.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-red-400">Common Pitfalls</h4>
              <ul className="list-disc pl-6 space-y-2 text-white/80">
                {method.commonPitfalls.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "CI/CD" && method.cicdIntegration && (
          <>
            <p className="text-white/60 mb-4">{method.cicdIntegration.notes}</p>
            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-purple-300 overflow-x-auto">
              <code>{method.cicdIntegration.config}</code>
            </pre>
          </>
        )}

        {activeTab === "Real World" && method.realWorldExample && (
          <>
            <h4 className="font-semibold mb-2">
              {method.realWorldExample.scenario}
            </h4>
            <p className="text-white/70 mb-4">
              {method.realWorldExample.description}
            </p>
            <ul className="list-decimal pl-6 space-y-2 text-white/80">
              {method.realWorldExample.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default TestingMethodModal