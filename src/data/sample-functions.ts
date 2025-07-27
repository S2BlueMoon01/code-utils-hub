import { UtilityFunction, Category, Language, Difficulty } from '@/types'

/**
 * Sample utility functions data
 * TODO: Replace with actual database integration
 */
export const sampleUtilityFunctions: UtilityFunction[] = [
  {
    id: '1',
    name: 'deepClone',
    description: 'Creates a deep clone of an object, handling nested objects and arrays',
    category: 'object' as Category,
    language: 'javascript' as Language,
    difficulty: 'intermediate' as Difficulty,
    code: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}`,
    examples: [
      {
        id: '1-1',
        title: 'Clone nested object',
        description: 'Clone an object with nested properties',
        code: `const original = { a: 1, b: { c: 2, d: [3, 4] } };
const cloned = deepClone(original);
console.log(cloned);`,
        output: '{ a: 1, b: { c: 2, d: [3, 4] } }'
      }
    ],
    testCases: [
      {
        id: '1-t1',
        input: { a: 1, b: { c: 2 } },
        expected_output: { a: 1, b: { c: 2 } },
        description: 'Should clone nested object'
      }
    ],
    tags: ['object', 'clone', 'deep', 'utility'],
    author: {
      id: 'user1',
      username: 'developer',
      email: 'dev@example.com',
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
  {
    id: '2',
    name: 'debounce',
    description: 'Limits the rate at which a function can fire, useful for search inputs and resize events',
    category: 'utility' as Category,
    language: 'javascript' as Language,
    difficulty: 'intermediate' as Difficulty,
    code: `function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}`,
    examples: [
      {
        id: '2-1',
        title: 'Debounce search input',
        description: 'Delay search execution until user stops typing',
        code: `const searchHandler = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Usage in input handler
input.addEventListener('input', (e) => searchHandler(e.target.value));`,
        output: 'Function will execute 300ms after last input'
      }
    ],
    testCases: [
      {
        id: '2-t1',
        input: { func: () => 'test', wait: 100 },
        expected_output: 'function',
        description: 'Should return a function'
      }
    ],
    tags: ['performance', 'debounce', 'events', 'timing'],
    author: {
      id: 'user2',
      username: 'jsexpert',
      email: 'js@example.com',
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
  {
    id: '3',
    name: 'formatCurrency',
    description: 'Formats a number as currency with locale-specific formatting',
    category: 'utility' as Category,
    language: 'javascript' as Language,
    difficulty: 'beginner' as Difficulty,
    code: `function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}`,
    examples: [
      {
        id: '3-1',
        title: 'Format USD currency',
        description: 'Format number as US dollars',
        code: `formatCurrency(1234.56, 'USD', 'en-US');`,
        output: '$1,234.56'
      },
      {
        id: '3-2',
        title: 'Format EUR currency',
        description: 'Format number as Euros',
        code: `formatCurrency(1234.56, 'EUR', 'de-DE');`,
        output: '1.234,56 €'
      }
    ],
    testCases: [
      {
        id: '3-t1',
        input: { amount: 1234.56, currency: 'USD', locale: 'en-US' },
        expected_output: '$1,234.56',
        description: 'Should format USD correctly'
      }
    ],
    tags: ['currency', 'formatting', 'internationalization', 'numbers'],
    author: {
      id: 'user3',
      username: 'webdev',
      email: 'web@example.com',
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
  {
    id: '4',
    name: 'isValidEmail',
    description: 'Validates email addresses using comprehensive regex pattern',
    category: 'validation' as Category,
    language: 'javascript' as Language,
    difficulty: 'beginner' as Difficulty,
    code: `function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}`,
    examples: [
      {
        id: '4-1',
        title: 'Valid email check',
        description: 'Check if email format is valid',
        code: `isValidEmail('user@example.com');`,
        output: 'true'
      },
      {
        id: '4-2',
        title: 'Invalid email check',
        description: 'Check invalid email format',
        code: `isValidEmail('invalid-email');`,
        output: 'false'
      }
    ],
    testCases: [
      {
        id: '4-t1',
        input: 'user@example.com',
        expected_output: true,
        description: 'Should validate correct email'
      },
      {
        id: '4-t2',
        input: 'invalid-email',
        expected_output: false,
        description: 'Should reject invalid email'
      }
    ],
    tags: ['validation', 'email', 'regex', 'forms'],
    author: {
      id: 'user1',
      username: 'developer',
      email: 'dev@example.com',
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
  {
    id: '5',
    name: 'chunk_array',
    description: 'Splits an array into chunks of specified size',
    category: 'array' as Category,
    language: 'python' as Language,
    difficulty: 'beginner' as Difficulty,
    code: `def chunk_array(arr, chunk_size):
    """
    Splits an array into chunks of specified size
    
    Args:
        arr: List to be chunked
        chunk_size: Size of each chunk
        
    Returns:
        List of chunks
    """
    if chunk_size <= 0:
        raise ValueError("Chunk size must be positive")
        
    return [arr[i:i + chunk_size] for i in range(0, len(arr), chunk_size)]`,
    examples: [
      {
        id: '5-1',
        title: 'Chunk numeric array',
        description: 'Split array into chunks of 3',
        code: `chunk_array([1, 2, 3, 4, 5, 6, 7, 8, 9], 3)`,
        output: '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]'
      }
    ],
    testCases: [
      {
        id: '5-t1',
        input: { arr: [1, 2, 3, 4, 5], chunk_size: 2 },
        expected_output: [[1, 2], [3, 4], [5]],
        description: 'Should chunk array correctly'
      }
    ],
    tags: ['array', 'chunking', 'split', 'python'],
    author: {
      id: 'user4',
      username: 'pythonista',
      email: 'python@example.com',
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
  }
]

/**
 * Categories with descriptions and counts
 */
export const categories = [
  { id: 'array', name: 'Array', description: 'Array manipulation and utilities', count: 12 },
  { id: 'string', name: 'String', description: 'String processing and formatting', count: 18 },
  { id: 'date', name: 'Date', description: 'Date and time utilities', count: 8 },
  { id: 'math', name: 'Math', description: 'Mathematical calculations and utilities', count: 15 },
  { id: 'object', name: 'Object', description: 'Object manipulation and utilities', count: 10 },
  { id: 'validation', name: 'Validation', description: 'Input validation and verification', count: 14 },
  { id: 'async', name: 'Async', description: 'Asynchronous operations and promises', count: 9 },
  { id: 'dom', name: 'DOM', description: 'DOM manipulation and utilities', count: 11 },
  { id: 'utility', name: 'Utility', description: 'General purpose utility functions', count: 20 }
]

/**
 * Popular tags with usage counts
 */
export const popularTags = [
  { name: 'performance', count: 45 },
  { name: 'validation', count: 38 },
  { name: 'formatting', count: 32 },
  { name: 'array', count: 29 },
  { name: 'string', count: 27 },
  { name: 'utility', count: 25 },
  { name: 'async', count: 22 },
  { name: 'object', count: 20 },
  { name: 'date', count: 18 },
  { name: 'math', count: 16 }
]
