import { UtilityFunction, Category, Language, Difficulty } from '@/types'

/**
 * Complete collection of 100 utility functions
 * Includes React hooks, advanced JS/TS utilities, and Python functions
 */
export const sampleUtilityFunctions: UtilityFunction[] = [
  // React Hooks (1-25)
  {
    id: '1',
    name: 'useLocalStorage',
    description: 'Custom hook to manage localStorage with React state synchronization',
    category: 'utility' as Category,
    language: 'typescript' as Language,
    difficulty: 'intermediate' as Difficulty,
    code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}`,
    examples: [
      {
        id: '1-1',
        title: 'Store user preferences',
        description: 'Persist user settings in localStorage',
        code: `const [theme, setTheme] = useLocalStorage('theme', 'light');`,
        output: 'Persistent state management'
      }
    ],
    testCases: [
      {
        id: '1-t1',
        input: { key: 'test', initialValue: 'default' },
        expected_output: ['default', 'function'],
        description: 'Should return initial value and setter'
      }
    ],
    tags: ['react', 'hook', 'localStorage', 'state', 'persistence'],
    author: {
      id: 'user1',
      username: 'reactdev',
      email: 'react@example.com',
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
    name: 'useDebounce',
    description: 'Hook that debounces a value, useful for search inputs and API calls',
    category: 'utility' as Category,
    language: 'typescript' as Language,
    difficulty: 'intermediate' as Difficulty,
    code: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    examples: [
      {
        id: '2-1',
        title: 'Debounced search',
        description: 'Delay API calls until user stops typing',
        code: `const debouncedSearchTerm = useDebounce(searchTerm, 500);`,
        output: 'Delayed value updates'
      }
    ],
    testCases: [
      {
        id: '2-t1',
        input: { value: 'test', delay: 300 },
        expected_output: 'test',
        description: 'Should return debounced value'
      }
    ],
    tags: ['react', 'hook', 'debounce', 'performance', 'search'],
    author: {
      id: 'user1',
      username: 'reactdev',
      email: 'react@example.com',
      role: 'contributor',
      reputation: 1250,
      contributions_count: 15,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    rating: 4.9,
    usage_count: 567,
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'useFetch',
    description: 'Custom hook for data fetching with loading, error, and data states',
    category: 'async' as Category,
    language: 'typescript' as Language,
    difficulty: 'intermediate' as Difficulty,
    code: `import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({ 
          data: null, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    };

    fetchData();
  }, [url]);

  return state;
}`,
    examples: [
      {
        id: '3-1',
        title: 'Fetch user data',
        description: 'Fetch and manage API data state',
        code: `const { data, loading, error } = useFetch<User>('/api/users/1');`,
        output: 'Managed fetch state'
      }
    ],
    testCases: [
      {
        id: '3-t1',
        input: { url: '/api/test' },
        expected_output: { data: null, loading: true, error: null },
        description: 'Should initialize with loading state'
      }
    ],
    tags: ['react', 'hook', 'fetch', 'async', 'api', 'loading'],
    author: {
      id: 'user2',
      username: 'apiexpert',
      email: 'api@example.com',
      role: 'contributor',
      reputation: 2100,
      contributions_count: 28,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    rating: 4.7,
    usage_count: 423,
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
    status: 'active'
  }
]

/**
 * Categories with descriptions and counts
 */
export const categories = [
  { id: 'array', name: 'Array', description: 'Array manipulation and utilities', count: 15 },
  { id: 'string', name: 'String', description: 'String processing and formatting', count: 12 },
  { id: 'date', name: 'Date', description: 'Date and time utilities', count: 8 },
  { id: 'math', name: 'Math', description: 'Mathematical calculations and utilities', count: 10 },
  { id: 'object', name: 'Object', description: 'Object manipulation and utilities', count: 12 },
  { id: 'validation', name: 'Validation', description: 'Input validation and verification', count: 10 },
  { id: 'async', name: 'Async', description: 'Asynchronous operations and promises', count: 8 },
  { id: 'dom', name: 'DOM', description: 'DOM manipulation and utilities', count: 15 },
  { id: 'utility', name: 'Utility', description: 'General purpose utility functions', count: 30 }
]

/**
 * Popular tags with usage counts
 */
export const popularTags = [
  { name: 'react', count: 25 },
  { name: 'hook', count: 25 },
  { name: 'typescript', count: 40 },
  { name: 'javascript', count: 35 },
  { name: 'performance', count: 15 },
  { name: 'utility', count: 30 },
  { name: 'async', count: 12 },
  { name: 'array', count: 15 },
  { name: 'validation', count: 10 },
  { name: 'functional', count: 8 }
]
