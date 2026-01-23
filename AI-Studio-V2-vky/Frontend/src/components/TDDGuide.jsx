import React from "react"
import { PlayCircle, AlertTriangle, CheckCircle } from "lucide-react"

const TDDGuide = ({ onStartLab }) => {
  return (
    <div className="max-w-5xl mx-auto text-white p-8 space-y-12">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold text-blue-400 mb-2">
          Test-Driven Development (TDD)
        </h1>
        <p className="text-white/70 text-lg">
          A practical guide to writing better code by letting tests drive design.
        </p>
      </header>

      {/* What is TDD */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">What is TDD?</h2>
        <p className="text-white/80 leading-relaxed">
          Test-Driven Development is a development workflow where you write tests
          before implementation. The goal is not test coverage, but better design,
          faster feedback, and safer refactoring.
        </p>
      </section>

      {/* When to use */}
      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <CheckCircle className="text-green-400" /> Use TDD when
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-white/80">
            <li>Building business-critical logic</li>
            <li>Developing APIs and services</li>
            <li>Refactoring risky code</li>
            <li>Working on long-lived codebases</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-400" /> Avoid TDD when
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-white/80">
            <li>Rapid UI experimentation</li>
            <li>Exploratory prototyping</li>
            <li>Throwaway scripts</li>
            <li>Requirements are unstable</li>
          </ul>
        </div>
      </section>

      {/* Workflow */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Red → Green → Refactor Workflow
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Red",
              desc: "Write a failing test that defines desired behavior."
            },
            {
              title: "Green",
              desc: "Write the smallest possible code to pass the test."
            },
            {
              title: "Refactor",
              desc: "Improve structure without changing behavior."
            }
          ].map(step => (
            <div
              key={step.title}
              className="bg-slate-800/60 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-white/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Good tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          What Good TDD Tests Look Like
        </h2>
        <pre className="bg-slate-900 p-4 rounded-lg text-green-300 text-sm overflow-x-auto">
{`it('throws error for negative amount', () => {
  expect(() => calculateTax(-10)).toThrow()
})`}
        </pre>
        <p className="text-white/70 mt-3">
          Tests should describe behavior. If naming a test feels hard,
          the design likely needs improvement.
        </p>
      </section>

      {/* Mistakes */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          Common TDD Mistakes
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-white/80">
          <li>Writing tests after implementation</li>
          <li>Testing private methods</li>
          <li>Over-mocking dependencies</li>
          <li>Chasing 100% coverage</li>
          <li>Writing large, unfocused tests</li>
        </ul>
      </section>

      {/* Next steps */}
      <section className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-1">
            Ready to practice TDD?
          </h3>
          <p className="text-white/70">
            Apply what you learned in an interactive Red–Green–Refactor lab.
          </p>
        </div>
        <button
          onClick={onStartLab}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
        >
          <PlayCircle className="w-5 h-5" />
          Start TDD Lab
        </button>
      </section>

    </div>
  )
}

export default TDDGuide;
