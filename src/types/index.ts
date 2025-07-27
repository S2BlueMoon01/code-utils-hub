/**
 * Language types supported by the platform
 */
export type Language = 'javascript' | 'typescript' | 'python'

/**
 * Function categories for organization
 */
export type Category = 
  | 'array'
  | 'string'
  | 'date'
  | 'math'
  | 'object'
  | 'validation'
  | 'async'
  | 'dom'
  | 'utility'

/**
 * Difficulty levels for functions
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

/**
 * Status types for various entities
 */
export type Status = 'active' | 'draft' | 'archived' | 'pending'

/**
 * User role types
 */
export type UserRole = 'user' | 'contributor' | 'moderator' | 'admin'

/**
 * Utility function interface
 */
export interface UtilityFunction {
  id: string
  name: string
  description: string
  category: Category
  language: Language
  difficulty: Difficulty
  code: string
  examples: Example[]
  testCases: TestCase[]
  tags: string[]
  author: User
  rating: number
  likes_count: number
  comments_count: number
  usage_count: number
  created_at: string
  updated_at: string
  status: Status
}

/**
 * Code example interface
 */
export interface Example {
  id: string
  title: string
  description: string
  code: string
  input?: string
  output: string
}

/**
 * Test case interface
 */
export interface TestCase {
  id: string
  input: unknown
  expected_output: unknown
  description: string
}

/**
 * User interface
 */
export interface User {
  id: string
  username: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  reputation: number
  contributions_count: number
  created_at: string
  updated_at: string
}

/**
 * Search filters interface
 */
export interface SearchFilters {
  query?: string
  language?: Language[]
  category?: Category[]
  difficulty?: Difficulty[]
  tags?: string[]
  author?: string
  sort_by?: 'relevance' | 'rating' | 'usage' | 'recent' | 'name'
  sort_order?: 'asc' | 'desc'
}

/**
 * Pagination interface
 */
export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

/**
 * API response interface
 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: Pagination
}

/**
 * Code execution result interface
 */
export interface ExecutionResult {
  success: boolean
  output: string
  error?: string
  execution_time?: number
  memory_usage?: number
}

/**
 * Playground session interface
 */
export interface PlaygroundSession {
  id: string
  language: Language
  code: string
  created_at: string
  updated_at: string
  is_public: boolean
  title?: string
  description?: string
  user_id?: string
}

/**
 * Comment interface
 */
export interface Comment {
  id: string
  content: string
  author: User
  function_id: string
  parent_id?: string
  created_at: string
  updated_at: string
  likes_count: number
  is_liked: boolean
}

/**
 * Rating interface
 */
export interface Rating {
  id: string
  rating: number
  comment?: string
  user_id: string
  function_id: string
  created_at: string
}

/**
 * Contribution interface
 */
export interface Contribution {
  id: string
  type: 'function' | 'example' | 'test_case' | 'documentation'
  title: string
  description: string
  content: unknown
  status: 'pending' | 'approved' | 'rejected'
  author: User
  reviewer?: User
  created_at: string
  updated_at: string
  review_notes?: string
}

/**
 * Theme types
 */
export type Theme = 'light' | 'dark' | 'system'

/**
 * Animation variants for Framer Motion
 */
export interface AnimationVariants {
  hidden: object
  visible: object
  exit?: object
}

/**
 * SEO metadata interface
 */
export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  canonical_url?: string
  og_image?: string
  og_type?: string
  twitter_card?: string
}
