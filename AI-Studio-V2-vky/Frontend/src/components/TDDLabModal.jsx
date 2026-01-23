import React, { useState } from "react"
import { 
  X, Play, CheckCircle, XCircle, RotateCcw, ArrowRight, 
  Code, AlertCircle, Lightbulb, Award, BookOpen, Zap,
  ChevronRight, Trophy, Target
} from "lucide-react"
// import { tddChallenges } from "../data/tddChallenges"

// TDD Challenge Data
const tddChallenges = [
  {
    id: 1,
    title: "Sum Function - Basic TDD",
    difficulty: "Beginner",
    description: "Create a function that adds two numbers together. Follow the Red-Green-Refactor cycle!",
    testCode: `// Test Suite (Red Phase - Failing Tests)
describe('sum function', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  
  test('adds negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });
  
  test('handles zero', () => {
    expect(sum(5, 0)).toBe(5);
  });
});`,
    starterCode: `// Write your sum function here
function sum(a, b) {
  // TODO: Make the tests pass!
  
}

export default sum;`,
    solution: `// Green Phase - Make tests pass
function sum(a, b) {
  return a + b;
}

export default sum;`,
    hints: [
      "🔴 RED: The tests are failing because sum() doesn't return anything",
      "🟢 GREEN: Return the sum of both parameters (a + b)",
      "🔵 REFACTOR: This solution is already simple and clean!"
    ],
    learningPoints: [
      "Start with failing tests (Red)",
      "Write minimal code to pass (Green)",
      "Clean up and optimize (Refactor)"
    ]
  },
  {
    id: 2,
    title: "Palindrome Checker",
    difficulty: "Intermediate",
    description: "Create a function that checks if a string reads the same forwards and backwards.",
    testCode: `// Test Suite (Red Phase)
describe('isPalindrome function', () => {
  test('returns true for "racecar"', () => {
    expect(isPalindrome('racecar')).toBe(true);
  });
  
  test('returns false for "hello"', () => {
    expect(isPalindrome('hello')).toBe(false);
  });
  
  test('handles empty strings', () => {
    expect(isPalindrome('')).toBe(true);
  });
  
  test('is case insensitive', () => {
    expect(isPalindrome('Racecar')).toBe(true);
  });
});`,
    starterCode: `// Write your palindrome checker
function isPalindrome(str) {
  // TODO: Implement palindrome check
  
}

export default isPalindrome;`,
    solution: `// Green Phase Solution
function isPalindrome(str) {
  const normalized = str.toLowerCase();
  return normalized === normalized.split('').reverse().join('');
}

export default isPalindrome;`,
    hints: [
      "🔴 RED: Tests fail - no implementation yet",
      "🟢 GREEN: Convert to lowercase, reverse the string, compare",
      "🔵 REFACTOR: Consider edge cases and performance"
    ],
    learningPoints: [
      "Handle case sensitivity",
      "Use string manipulation methods",
      "Write tests before implementation"
    ]
  },
  {
    id: 3,
    title: "FizzBuzz Function",
    difficulty: "Beginner",
    description: "Classic TDD problem: Return 'Fizz' for multiples of 3, 'Buzz' for 5, 'FizzBuzz' for both.",
    testCode: `// Test Suite (Red Phase)
describe('fizzBuzz function', () => {
  test('returns "Fizz" for multiples of 3', () => {
    expect(fizzBuzz(3)).toBe('Fizz');
    expect(fizzBuzz(6)).toBe('Fizz');
  });
  
  test('returns "Buzz" for multiples of 5', () => {
    expect(fizzBuzz(5)).toBe('Buzz');
    expect(fizzBuzz(10)).toBe('Buzz');
  });
  
  test('returns "FizzBuzz" for multiples of both', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
    expect(fizzBuzz(30)).toBe('FizzBuzz');
  });
  
  test('returns number as string for other numbers', () => {
    expect(fizzBuzz(1)).toBe('1');
    expect(fizzBuzz(7)).toBe('7');
  });
});`,
    starterCode: `// Write your FizzBuzz function
function fizzBuzz(num) {
  // TODO: Implement FizzBuzz logic
  
}

export default fizzBuzz;`,
    solution: `// Green Phase Solution
function fizzBuzz(num) {
  if (num % 15 === 0) return 'FizzBuzz';
  if (num % 3 === 0) return 'Fizz';
  if (num % 5 === 0) return 'Buzz';
  return String(num);
}

export default fizzBuzz;`,
    hints: [
      "🔴 RED: All tests failing - no logic implemented",
      "🟢 GREEN: Check divisibility by 15 first, then 3, then 5",
      "🔵 REFACTOR: Order matters! Check 15 before 3 and 5"
    ],
    learningPoints: [
      "Test edge cases first",
      "Order of conditions matters",
      "Convert number to string for consistency"
    ]
  },
  {
    id: 4,
    title: "Array Filter Duplicates",
    difficulty: "Intermediate",
    description: "Create a function that removes duplicate values from an array.",
    testCode: `// Test Suite (Red Phase)
describe('removeDuplicates function', () => {
  test('removes duplicate numbers', () => {
    expect(removeDuplicates([1, 2, 2, 3, 4, 4, 5]))
      .toEqual([1, 2, 3, 4, 5]);
  });
  
  test('handles empty array', () => {
    expect(removeDuplicates([])).toEqual([]);
  });
  
  test('handles array with no duplicates', () => {
    expect(removeDuplicates([1, 2, 3]))
      .toEqual([1, 2, 3]);
  });
  
  test('removes duplicate strings', () => {
    expect(removeDuplicates(['a', 'b', 'b', 'c']))
      .toEqual(['a', 'b', 'c']);
  });
});`,
    starterCode: `// Write your duplicate remover
function removeDuplicates(arr) {
  // TODO: Remove duplicates from array
  
}

export default removeDuplicates;`,
    solution: `// Green Phase Solution
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

export default removeDuplicates;`,
    hints: [
      "🔴 RED: Tests fail - function returns undefined",
      "🟢 GREEN: Use Set to remove duplicates, spread back to array",
      "🔵 REFACTOR: ES6 Set provides the cleanest solution"
    ],
    learningPoints: [
      "Use Set for unique values",
      "Spread operator converts Set to Array",
      "Simple solutions are often the best"
    ]
  }
]

const TDDLabModal = ({ isOpen, onClose }) => {
  const [currentChallenge, setCurrentChallenge] = useState(tddChallenges[0])
  const [userCode, setUserCode] = useState(tddChallenges[0].starterCode)
  const [currentPhase, setCurrentPhase] = useState("red") // red, green, refactor
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [testsPassed, setTestsPassed] = useState(false)
  const [showChallengeList, setShowChallengeList] = useState(false)

  if (!isOpen) return null

  const phases = [
    { id: "red", label: "Red", icon: XCircle, color: "text-red-400", bgColor: "bg-red-500/20" },
    { id: "green", label: "Green", icon: CheckCircle, color: "text-green-400", bgColor: "bg-green-500/20" },
    { id: "refactor", label: "Refactor", icon: Zap, color: "text-blue-400", bgColor: "bg-blue-500/20" }
  ]

  const handleRunTests = () => {
    // Simulate test running
    const hasReturnStatement = userCode.includes("return")
    const isNotEmpty = userCode.trim().length > currentChallenge.starterCode.trim().length
    
    if (hasReturnStatement && isNotEmpty) {
      setTestsPassed(true)
      if (currentPhase === "red") {
        setTimeout(() => setCurrentPhase("green"), 1000)
      } else if (currentPhase === "green") {
        setTimeout(() => setCurrentPhase("refactor"), 1000)
      }
    } else {
      setTestsPassed(false)
    }
  }

  const handleReset = () => {
    setUserCode(currentChallenge.starterCode)
    setCurrentPhase("red")
    setTestsPassed(false)
    setShowHints(false)
    setShowSolution(false)
  }

  const handleSelectChallenge = (challenge) => {
    setCurrentChallenge(challenge)
    setUserCode(challenge.starterCode)
    setCurrentPhase("red")
    setTestsPassed(false)
    setShowHints(false)
    setShowSolution(false)
    setShowChallengeList(false)
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Beginner": return "text-green-400 bg-green-500/20 border-green-500/30"
      case "Intermediate": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      case "Advanced": return "text-red-400 bg-red-500/20 border-red-500/30"
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Interactive TDD Lab
                <span className={`text-sm px-3 py-1 rounded-lg border ${getDifficultyColor(currentChallenge.difficulty)}`}>
                  {currentChallenge.difficulty}
                </span>
              </h2>
              <p className="text-white/60 text-sm mt-1">{currentChallenge.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChallengeList(!showChallengeList)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold transition flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Challenges ({tddChallenges.length})
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-6 h-6 text-white/60" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Challenge List Sidebar */}
          {showChallengeList && (
            <div className="w-80 border-r border-white/10 overflow-y-auto bg-slate-900/50">
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Available Challenges
                </h3>
                <div className="space-y-3">
                  {tddChallenges.map((challenge) => (
                    <button
                      key={challenge.id}
                      onClick={() => handleSelectChallenge(challenge)}
                      className={`w-full text-left p-4 rounded-xl border transition ${
                        currentChallenge.id === challenge.id
                          ? "bg-blue-500/20 border-blue-500/40"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white text-sm">{challenge.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-2">{challenge.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* TDD Cycle Progress */}
            <div className="p-6 border-b border-white/10 bg-slate-900/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Red-Green-Refactor Cycle</h3>
                <div className="flex items-center gap-2">
                  {phases.map((phase) => {
                    const Icon = phase.icon
                    const isActive = currentPhase === phase.id
                    const isComplete = phases.findIndex(p => p.id === currentPhase) > phases.findIndex(p => p.id === phase.id)
                    
                    return (
                      <React.Fragment key={phase.id}>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                          isActive ? `${phase.bgColor} border-${phase.color.split('-')[1]}-500/40` :
                          isComplete ? "bg-white/10 border-white/20" :
                          "bg-white/5 border-white/10"
                        }`}>
                          <Icon className={`w-4 h-4 ${isActive || isComplete ? phase.color : "text-white/40"}`} />
                          <span className={`text-sm font-semibold ${isActive || isComplete ? "text-white" : "text-white/40"}`}>
                            {phase.label}
                          </span>
                        </div>
                        {phase.id !== "refactor" && (
                          <ChevronRight className="w-5 h-5 text-white/30" />
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
              
              <p className="text-white/70 text-sm">{currentChallenge.description}</p>
            </div>

            {/* Code Editor Area */}
            <div className="flex-1 grid grid-cols-2 gap-4 p-6 overflow-hidden">
              
              {/* Test Code (Left) */}
              <div className="flex flex-col overflow-hidden bg-slate-950/50 rounded-xl border border-white/10">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-red-400" />
                    <h4 className="font-semibold text-white">Test Suite (Read Only)</h4>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-lg ${
                    testsPassed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {testsPassed ? "✓ All Tests Pass" : "✗ Tests Failing"}
                  </span>
                </div>
                <pre className="flex-1 overflow-auto p-4 text-sm">
                  <code className="text-white/80 font-mono">{currentChallenge.testCode}</code>
                </pre>
              </div>

              {/* User Code (Right) */}
              <div className="flex flex-col overflow-hidden bg-slate-950/50 rounded-xl border border-white/10">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-400" />
                    <h4 className="font-semibold text-white">Your Implementation</h4>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRunTests}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Run Tests
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                      title="Reset Code"
                    >
                      <RotateCcw className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="flex-1 overflow-auto p-4 text-sm bg-transparent text-white/80 font-mono resize-none focus:outline-none"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-white/10 bg-slate-900/50">
              <div className="flex items-center justify-between">
                
                {/* Hints */}
                <div className="flex-1">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-sm font-semibold transition flex items-center gap-2 text-yellow-300"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showHints ? "Hide Hints" : "Show Hints"}
                  </button>
                  
                  {showHints && (
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <h5 className="font-semibold text-yellow-300 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Hints for {currentPhase.toUpperCase()} Phase:
                      </h5>
                      <ul className="space-y-2">
                        {currentChallenge.hints.map((hint, index) => (
                          <li key={index} className="text-sm text-white/70 flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Solution */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-sm font-semibold transition flex items-center gap-2 text-purple-300"
                  >
                    <Award className="w-4 h-4" />
                    {showSolution ? "Hide Solution" : "Show Solution"}
                  </button>
                  
                  {testsPassed && currentPhase === "refactor" && (
                    <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-semibold text-green-300">Challenge Complete!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Solution Display */}
              {showSolution && (
                <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <h5 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Solution Code:
                  </h5>
                  <pre className="bg-slate-950/50 rounded-lg p-4 overflow-x-auto">
                    <code className="text-white/80 font-mono text-sm">{currentChallenge.solution}</code>
                  </pre>
                  <div className="mt-4">
                    <h6 className="font-semibold text-purple-300 mb-2">Key Learning Points:</h6>
                    <ul className="space-y-1">
                      {currentChallenge.learningPoints.map((point, index) => (
                        <li key={index} className="text-sm text-white/70 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TDDLabModal;