import { UtilityFunction, Category, Language, Difficulty } from '@/types'

/**
 * 10 Cross-language utility functions that can run and be converted between languages
 */
export const sampleUtilityFunctions: UtilityFunction[] = [
  // Function 1: Palindrome Check
  {
    id: '1',
    name: 'isPalindrome',
    description: 'Check if a string is a palindrome (reads the same forwards and backwards)',
    category: 'string' as Category,
    language: 'javascript' as Language,
    difficulty: 'beginner' as Difficulty,
    code: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

// Test the function
console.log(isPalindrome("A man a plan a canal Panama")); // true
console.log(isPalindrome("race a car")); // false
console.log(isPalindrome("hello")); // false`,
    examples: [
      {
        id: '1-1',
        title: 'Check palindrome phrase',
        description: 'Test with common palindrome',
        code: `isPalindrome("A man a plan a canal Panama");`,
        output: 'true'
      }
    ],
    testCases: [
      {
        id: '1-t1',
        input: "racecar",
        expected_output: true,
        description: 'Should detect palindrome'
      }
    ],
    tags: ['string', 'palindrome', 'algorithm'],
    author: {
      id: 'user1',
      username: 'coder',
      email: 'coder@example.com',
      role: 'contributor',
      reputation: 1250,
      contributions_count: 15,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    rating: 4.8,
    usage_count: 342,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    status: 'active'
  },
  
  // Function 2: Fibonacci Sequence
  {
    id: '2',
    name: 'fibonacci',
    description: 'Generate Fibonacci sequence up to n numbers',
    category: 'math' as Category,
    language: 'javascript' as Language,
    difficulty: 'intermediate' as Difficulty,
    code: `function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];
  
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result[i] = result[i - 1] + result[i - 2];
  }
  return result;
}

// Test the function
console.log(fibonacci(10)); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
console.log(fibonacci(5));  // [0, 1, 1, 2, 3]`,
    examples: [
      {
        id: '2-1',
        title: 'Generate 10 Fibonacci numbers',
        description: 'Get first 10 numbers in sequence',
        code: `fibonacci(10);`,
        output: '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]'
      }
    ],
    testCases: [
      {
        id: '2-t1',
        input: 5,
        expected_output: [0, 1, 1, 2, 3],
        description: 'Should generate correct sequence'
      }
    ],
    tags: ['math', 'fibonacci', 'sequence', 'algorithm'],
    author: {
      id: 'user2',
      username: 'mathdev',
      email: 'math@example.com',
      role: 'contributor',
      reputation: 2100,
      contributions_count: 28,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    rating: 4.9,
    usage_count: 567,
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
    status: 'active'
  },

  // Function 3: Array Sum
  {
    id: '3',
    name: 'arraySum',
    description: 'Calculate the sum of all numbers in an array',
    category: 'array' as Category,
    language: 'javascript' as Language,
    difficulty: 'beginner' as Difficulty,
    code: `function arraySum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

// Test the function
console.log(arraySum([1, 2, 3, 4, 5])); // 15
console.log(arraySum([10, -5, 8]));     // 13
console.log(arraySum([]));              // 0`,
    examples: [
      {
        id: '3-1',
        title: 'Sum array of numbers',
        description: 'Calculate total of array elements',
        code: `arraySum([1, 2, 3, 4, 5]);`,
        output: '15'
      }
    ],
    testCases: [
      {
        id: '3-t1',
        input: [1, 2, 3],
        expected_output: 6,
        description: 'Should sum array correctly'
      }
    ],
    tags: ['array', 'sum', 'reduce'],
    author: {
      id: 'user3',
      username: 'arraymaster',
      email: 'array@example.com',
      role: 'user',
      reputation: 450,
      contributions_count: 5,
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-18T00:00:00Z'
    },
    rating: 4.6,
    usage_count: 189,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    status: 'active'
  },

  // Function 4: Prime Number Check
  {
    id: '4',
    name: 'isPrime',
    description: 'Check if a number is prime',
    category: 'math' as Category,
    language: 'javascript' as Language,
    difficulty: 'intermediate' as Difficulty,
    code: `function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

// Test the function
console.log(isPrime(17)); // true
console.log(isPrime(15)); // false
console.log(isPrime(2));  // true
console.log(isPrime(1));  // false`,
    examples: [
      {
        id: '4-1',
        title: 'Check if 17 is prime',
        description: 'Test prime number detection',
        code: `isPrime(17);`,
        output: 'true'
      }
    ],
    testCases: [
      {
        id: '4-t1',
        input: 7,
        expected_output: true,
        description: 'Should detect prime number'
      }
    ],
    tags: ['math', 'prime', 'algorithm'],
    author: {
      id: 'user1',
      username: 'coder',
      email: 'coder@example.com',
      role: 'contributor',
      reputation: 1250,
      contributions_count: 15,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    rating: 4.7,
    usage_count: 423,
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
    status: 'active'
  },

  // Function 5: String Reverser
  {
    id: '5',
    name: 'reverseString',
    description: 'Reverse a string without using built-in reverse method',
    category: 'string' as Category,
    language: 'javascript' as Language,
    difficulty: 'beginner' as Difficulty,
    code: `function reverseString(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Test the function
console.log(reverseString("hello"));     // "olleh"
console.log(reverseString("JavaScript")); // "tpircSavaJ"
console.log(reverseString("12345"));     // "54321"`,
    examples: [
      {
        id: '5-1',
        title: 'Reverse hello',
        description: 'Reverse a simple string',
        code: `reverseString("hello");`,
        output: '"olleh"'
      }
    ],
    testCases: [
      {
        id: '5-t1',
        input: "abc",
        expected_output: "cba",
        description: 'Should reverse string correctly'
      }
    ],
    tags: ['string', 'reverse', 'loop'],
    author: {
      id: 'user4',
      username: 'stringdev',
      email: 'string@example.com',
      role: 'contributor',
      reputation: 1800,
      contributions_count: 22,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    rating: 4.5,
    usage_count: 234,
    created_at: '2024-01-14T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z',
    status: 'active'
  },

  // Function 6: Factorial Calculator
  {
    id: '6',
    name: 'factorial',
    description: 'Calculate factorial of a number (n!)',
    category: 'math' as Category,
    language: 'javascript' as Language,
    difficulty: 'beginner' as Difficulty,
    code: `function factorial(n) {
  if (n < 0) return undefined;
  if (n === 0 || n === 1) return 1;
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Test the function
console.log(factorial(5)); // 120
console.log(factorial(0)); // 1
console.log(factorial(3)); // 6`,
    examples: [
      {
        id: '6-1',
        title: 'Calculate 5!',
        description: 'Get factorial of 5',
        code: `factorial(5);`,
        output: '120'
      }
    ],
    testCases: [
      {
        id: '6-t1',
        input: 4,
        expected_output: 24,
        description: 'Should calculate factorial correctly'
      }
    ],
    tags: ['math', 'factorial', 'recursion'],
    author: {
      id: 'user2',
      username: 'mathdev',
      email: 'math@example.com',
      role: 'contributor',
      reputation: 2100,
      contributions_count: 28,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    rating: 4.8,
    usage_count: 345,
    created_at: '2024-01-16T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z',
    status: 'active'
  },

  // Function 7: Find Maximum in Array
  {
    id: '7',
    name: 'findMax',
    description: 'Find the maximum value in an array of numbers',
    category: 'array' as Category,
    language: 'javascript' as Language,
    difficulty: 'beginner' as Difficulty,
    code: `function findMax(numbers) {
  if (numbers.length === 0) return undefined;
  
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}

// Test the function
console.log(findMax([3, 7, 2, 9, 1])); // 9
console.log(findMax([-5, -2, -10]));   // -2
console.log(findMax([42]));             // 42`,
    examples: [
      {
        id: '7-1',
        title: 'Find max in array',
        description: 'Get largest number from array',
        code: `findMax([3, 7, 2, 9, 1]);`,
        output: '9'
      }
    ],
    testCases: [
      {
        id: '7-t1',
        input: [1, 5, 3],
        expected_output: 5,
        description: 'Should find maximum value'
      }
    ],
    tags: ['array', 'maximum', 'search'],
    author: {
      id: 'user3',
      username: 'arraymaster',
      email: 'array@example.com',
      role: 'user',
      reputation: 450,
      contributions_count: 5,
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-18T00:00:00Z'
    },
    rating: 4.4,
    usage_count: 278,
    created_at: '2024-01-17T00:00:00Z',
    updated_at: '2024-01-17T00:00:00Z',
    status: 'active'
  },

  // Function 8: Count Characters
  {
    id: '8',
    name: 'countChars',
    description: 'Count frequency of each character in a string',
    category: 'string' as Category,
    language: 'javascript' as Language,
    difficulty: 'intermediate' as Difficulty,
    code: `function countChars(str) {
  const charCount = {};
  
  for (let char of str.toLowerCase()) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  return charCount;
}

// Test the function
console.log(countChars("hello")); // {h: 1, e: 1, l: 2, o: 1}
console.log(countChars("JavaScript")); // {j: 1, a: 2, v: 1, s: 1, c: 1, r: 1, i: 1, p: 1, t: 1}`,
    examples: [
      {
        id: '8-1',
        title: 'Count chars in hello',
        description: 'Get character frequency',
        code: `countChars("hello");`,
        output: '{h: 1, e: 1, l: 2, o: 1}'
      }
    ],
    testCases: [
      {
        id: '8-t1',
        input: "aab",
        expected_output: {a: 2, b: 1},
        description: 'Should count characters correctly'
      }
    ],
    tags: ['string', 'count', 'frequency'],
    author: {
      id: 'user4',
      username: 'stringdev',
      email: 'string@example.com',
      role: 'contributor',
      reputation: 1800,
      contributions_count: 22,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    rating: 4.6,
    usage_count: 156,
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z',
    status: 'active'
  },

  // Function 9: Remove Duplicates
  {
    id: '9',
    name: 'removeDuplicates',
    description: 'Remove duplicate values from an array',
    category: 'array' as Category,
    language: 'javascript' as Language,
    difficulty: 'intermediate' as Difficulty,
    code: `function removeDuplicates(arr) {
  const unique = [];
  const seen = new Set();
  
  for (let item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      unique.push(item);
    }
  }
  
  return unique;
}

// Test the function
console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]
console.log(removeDuplicates(['a', 'b', 'a', 'c']));   // ['a', 'b', 'c']`,
    examples: [
      {
        id: '9-1',
        title: 'Remove number duplicates',
        description: 'Clean array of duplicate numbers',
        code: `removeDuplicates([1, 2, 2, 3, 4, 4, 5]);`,
        output: '[1, 2, 3, 4, 5]'
      }
    ],
    testCases: [
      {
        id: '9-t1',
        input: [1, 1, 2, 3, 3],
        expected_output: [1, 2, 3],
        description: 'Should remove duplicates'
      }
    ],
    tags: ['array', 'duplicates', 'unique'],
    author: {
      id: 'user3',
      username: 'arraymaster',
      email: 'array@example.com',
      role: 'user',
      reputation: 450,
      contributions_count: 5,
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-18T00:00:00Z'
    },
    rating: 4.7,
    usage_count: 398,
    created_at: '2024-01-19T00:00:00Z',
    updated_at: '2024-01-19T00:00:00Z',
    status: 'active'
  },

  // Function 10: Simple Calculator
  {
    id: '10',
    name: 'calculator',
    description: 'Simple calculator for basic arithmetic operations',
    category: 'math' as Category,
    language: 'javascript' as Language,
    difficulty: 'beginner' as Difficulty,
    code: `function calculator(num1, operator, num2) {
  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return num2 !== 0 ? num1 / num2 : 'Error: Division by zero';
    default:
      return 'Error: Invalid operator';
  }
}

// Test the function
console.log(calculator(10, '+', 5));  // 15
console.log(calculator(10, '-', 3));  // 7
console.log(calculator(4, '*', 6));   // 24
console.log(calculator(15, '/', 3));  // 5`,
    examples: [
      {
        id: '10-1',
        title: 'Add two numbers',
        description: 'Perform addition operation',
        code: `calculator(10, '+', 5);`,
        output: '15'
      }
    ],
    testCases: [
      {
        id: '10-t1',
        input: {num1: 6, operator: '*', num2: 7},
        expected_output: 42,
        description: 'Should calculate correctly'
      }
    ],
    tags: ['math', 'calculator', 'arithmetic'],
    author: {
      id: 'user2',
      username: 'mathdev',
      email: 'math@example.com',
      role: 'contributor',
      reputation: 2100,
      contributions_count: 28,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    rating: 4.5,
    usage_count: 467,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    status: 'active'
  }
]

/**
 * Categories with descriptions and counts
 */
export const categories = [
  { id: 'array', name: 'Array', description: 'Array manipulation and utilities', count: 3 },
  { id: 'string', name: 'String', description: 'String processing and formatting', count: 3 },
  { id: 'math', name: 'Math', description: 'Mathematical calculations and utilities', count: 4 },
  { id: 'object', name: 'Object', description: 'Object manipulation and utilities', count: 0 },
  { id: 'validation', name: 'Validation', description: 'Input validation and verification', count: 0 },
  { id: 'async', name: 'Async', description: 'Asynchronous operations and promises', count: 0 },
  { id: 'dom', name: 'DOM', description: 'DOM manipulation and utilities', count: 0 },
  { id: 'utility', name: 'Utility', description: 'General purpose utility functions', count: 0 }
]

/**
 * Popular tags with usage counts
 */
export const popularTags = [
  { name: 'algorithm', count: 4 },
  { name: 'math', count: 4 },
  { name: 'string', count: 3 },
  { name: 'array', count: 3 },
  { name: 'javascript', count: 10 },
  { name: 'fibonacci', count: 1 },
  { name: 'palindrome', count: 1 },
  { name: 'prime', count: 1 },
  { name: 'factorial', count: 1 },
  { name: 'calculator', count: 1 }
]
