import React from "react"
import { AlertTriangle, CheckCircle, Users, BookOpen } from "lucide-react"

const BDDGuide = () => {
  return (
    <div className="max-w-5xl mx-auto text-white p-8 space-y-12">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold text-purple-400 mb-2">
          Behavior-Driven Development (BDD)
        </h1>
        <p className="text-white/70 text-lg">
          A practical guide to aligning developers, testers, and product teams
          around shared behavior.
        </p>
      </header>

      {/* What is BDD */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">What is BDD?</h2>
        <p className="text-white/80 leading-relaxed">
          Behavior-Driven Development is a collaborative workflow where expected
          system behavior is defined using examples before implementation.
          The goal of BDD is not automation — it is shared understanding.
        </p>
      </section>

      {/* When to use / avoid */}
      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <CheckCircle className="text-green-400" /> Use BDD when
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-white/80">
            <li>Multiple roles collaborate (QA, Dev, PM)</li>
            <li>Business logic is complex</li>
            <li>Requirements change frequently</li>
            <li>Miscommunication causes defects</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-400" /> Avoid BDD when
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-white/80">
            <li>Solo development</li>
            <li>Small or static projects</li>
            <li>No product or QA involvement</li>
            <li>Scenarios are never maintained</li>
          </ul>
        </div>
      </section>

      {/* Workflow */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          How BDD Works in Real Teams
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              title: "Define Behavior",
              desc: "Product describes expected behavior using examples."
            },
            {
              title: "Write Scenarios",
              desc: "QA writes scenarios in plain language (Gherkin)."
            },
            {
              title: "Implement Steps",
              desc: "Developers map steps to code."
            },
            {
              title: "Automate & Verify",
              desc: "Scenarios run in CI as living documentation."
            }
          ].map(step => (
            <div
              key={step.title}
              className="bg-slate-800/60 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-white/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gherkin example */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          Writing Good BDD Scenarios
        </h2>
        <pre className="bg-slate-900 p-4 rounded-lg text-green-300 text-sm overflow-x-auto">
{`Scenario: Valid password reset
  Given a registered user
  When the user requests a password reset
  Then a reset email should be sent`}
        </pre>
        <p className="text-white/70 mt-3">
          Good scenarios describe <strong>behavior</strong>, not implementation.
          Avoid technical details like APIs, status codes, or database steps.
        </p>
      </section>

      {/* Common mistakes */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          Common BDD Mistakes
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-white/80">
          <li>Scenarios written like test cases</li>
          <li>Too many steps per scenario</li>
          <li>No shared ownership of scenarios</li>
          <li>Scenarios not updated when behavior changes</li>
          <li>Using BDD without team collaboration</li>
        </ul>
      </section>

      {/* Next steps */}
      <section className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Users className="w-8 h-8 text-purple-400 mt-1" />
          <div>
            <h3 className="text-xl font-semibold mb-1">
              What should you do next?
            </h3>
            <p className="text-white/70 mb-3">
              Start by applying BDD in planning and refinement meetings.
              Automation comes later — alignment comes first.
            </p>
            <p className="text-white/60 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Interactive BDD labs coming soon
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

export default BDDGuide;
