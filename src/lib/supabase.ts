import { createClient } from '@supabase/supabase-js'

// Environment configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjI0MDAwMCwiZXhwIjoxOTYxODE2MDAwfQ.demo-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface UserProfile {
  id: string
  email: string
  username: string
  full_name: string
  avatar_url?: string
  role: 'user' | 'contributor' | 'admin'
  reputation: number
  contributions_count: number
  created_at: string
  updated_at: string
}

export interface UtilityFunction {
  id: string
  title: string
  description: string
  code: string
  language: 'javascript' | 'typescript' | 'python'
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  author_id: string
  author: UserProfile
  likes_count: number
  views_count: number
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface FunctionRating {
  id: string
  function_id: string
  user_id: string
  rating: number
  comment?: string
  created_at: string
}

export interface FunctionComment {
  id: string
  function_id: string
  user_id: string
  user: UserProfile
  content: string
  parent_id?: string
  created_at: string
  updated_at: string
}

// Database helper functions
export const dbHelpers = {
  // User management
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data as UserProfile
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data as UserProfile
  },

  // Function management
  async getFunctions(filters?: {
    category?: string
    language?: string
    difficulty?: string
    search?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('utility_functions')
      .select(`
        *,
        author:user_profiles(id, username, avatar_url, reputation)
      `)
      .eq('is_approved', true)
    
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.language) {
      query = query.eq('language', filters.language)
    }
    
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty)
    }
    
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data as UtilityFunction[]
  },

  async createFunction(functionData: Omit<UtilityFunction, 'id' | 'author' | 'likes_count' | 'views_count' | 'is_approved' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('utility_functions')
      .insert(functionData)
      .select()
      .single()
    
    if (error) throw error
    return data as UtilityFunction
  },

  async getFunctionById(id: string) {
    const { data, error } = await supabase
      .from('utility_functions')
      .select(`
        *,
        author:user_profiles(id, username, avatar_url, reputation)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as UtilityFunction
  },

  // Rating and comments
  async rateFunction(functionId: string, userId: string, rating: number, comment?: string) {
    const { data, error } = await supabase
      .from('function_ratings')
      .upsert({
        function_id: functionId,
        user_id: userId,
        rating,
        comment
      })
      .select()
      .single()
    
    if (error) throw error
    return data as FunctionRating
  },

  async getFunctionRatings(functionId: string) {
    const { data, error } = await supabase
      .from('function_ratings')
      .select(`
        *,
        user:user_profiles(id, username, avatar_url)
      `)
      .eq('function_id', functionId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async addComment(functionId: string, userId: string, content: string, parentId?: string) {
    const { data, error } = await supabase
      .from('function_comments')
      .insert({
        function_id: functionId,
        user_id: userId,
        content,
        parent_id: parentId
      })
      .select(`
        *,
        user:user_profiles(id, username, avatar_url)
      `)
      .single()
    
    if (error) throw error
    return data as FunctionComment
  },

  async getFunctionComments(functionId: string) {
    const { data, error } = await supabase
      .from('function_comments')
      .select(`
        *,
        user:user_profiles(id, username, avatar_url)
      `)
      .eq('function_id', functionId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as FunctionComment[]
  }
}
