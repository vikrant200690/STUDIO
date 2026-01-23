import React, { useState } from "react";
import { X, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

const STEPS = [
  {
    id: "product",
    title: "What are you building?",
    type: "single",
    options: [
      "Web App",
      "Mobile App",
      "Backend", // Matches Kit 2, 3, 4, 5, 9
      "Full Stack Application", // Matches Kit 1, 2, 7
      "AI", // Matches Kit 3
      "CI/CD", // Matches Kit 11
    ],
  },
  {
    id: "level",
    title: "Your experience level?",
    type: "single",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    id: "tech",
    title: "Tech needs (select all that apply)",
    type: "multi",
    options: [
      "React / Next.js",
      "Node.js",
      "Javascript",
      "Python",
      "Java",
      "AI", // Matches your kit metadata "AI" tags
      "Authentication",
      "Database",
      "CI/CD",
    ],
  },
  {
    id: "priority",
    title: "Top priority?",
    type: "single",
    options: [
      "Fast Setup",
      "Best Practices",
      "Scalability",
      "Learning Friendly",
    ],
  },
];

const StartupKitQuiz = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    product: null,
    level: null,
    team: null,
    timeline: null,
    tech: [],
    priority: null,
  });

    const current = STEPS[step];
    const progress = Math.round((step / STEPS.length) * 100);

  const handleSelect = (value) => {
    if (current.type === "single") {
      setAnswers({ ...answers, [current.id]: value });
      setTimeout(() => next(), 200);
    } else {
      const exists = answers.tech.includes(value);
      setAnswers({
        ...answers,
        tech: exists
          ? answers.tech.filter((v) => v !== value)
          : [...answers.tech, value],
      });
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete(answers);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 pt-10 relative">

        {/* Close */}
        <button
          onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white z-10"
        >
          <X />
        </button>

        {/* Progress */}
        <div className="mb-6">
        <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
            />
        </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
        <p className="text-white/60 mb-6">
          This helps us recommend the best startup kits for you.
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {current.options.map((option) => {
            const selected =
              current.type === "single"
                ? answers[current.id] === option
                : answers.tech.includes(option);

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all
                  ${
                    selected
                      ? "bg-blue-600/20 border-blue-500 text-blue-300"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                  }`}
              >
                <span>{option}</span>
                {selected && <CheckCircle className="w-5 h-5" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {current.type === "multi" && (
            <button
              onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupKitQuiz;
