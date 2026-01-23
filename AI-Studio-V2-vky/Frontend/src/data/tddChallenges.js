export const tddChallenges = [
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

