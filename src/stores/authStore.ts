import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, UserProfile, dbHelpers } from '@/lib/supabase'

interface AuthResult {
  data: {
    user: User | null
    session: Session | null
  } | null
  error: AuthError | null
}

interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>
  loadUserProfile: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      loading: true,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProfile: (profile) => set({ profile }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),

      signUp: async (email: string, password: string, metadata = {}) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: metadata
            }
          })

          if (data.user) {
            set({ user: data.user, session: data.session, isAuthenticated: true })
            await get().loadUserProfile()
          }

          return { data, error }
        } catch (error) {
          console.error('Sign up error:', error)
          return { data: null, error: error as AuthError }
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })

          if (data.user) {
            set({ user: data.user, session: data.session, isAuthenticated: true })
            await get().loadUserProfile()
          }

          return { data, error }
        } catch (error) {
          console.error('Sign in error:', error)
          return { data: null, error: error as AuthError }
        }
      },

      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut()
          set({ user: null, profile: null, session: null, isAuthenticated: false })
          return { error }
        } catch (error) {
          console.error('Sign out error:', error)
          return { error: error as AuthError }
        }
      },

      updateProfile: async (updates: Partial<UserProfile>) => {
        const { user } = get()
        if (!user) throw new Error('User not authenticated')

        try {
          const updatedProfile = await dbHelpers.updateUserProfile(user.id, updates)
          set({ profile: updatedProfile })
          return updatedProfile
        } catch (error) {
          console.error('Update profile error:', error)
          throw error
        }
      },

      loadUserProfile: async () => {
        const { user } = get()
        if (!user) return

        try {
          const profile = await dbHelpers.getUserProfile(user.id)
          set({ profile })
        } catch (error) {
          console.error('Load profile error:', error)
          // Create mock profile for demo mode
          const mockProfile: UserProfile = {
            id: user.id,
            email: user.email || '',
            username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url,
            role: 'user',
            reputation: 100,
            contributions_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          set({ profile: mockProfile })
        }
      },

      initialize: async () => {
        try {
          set({ loading: true })

          // Get initial session
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            set({ 
              user: session.user, 
              session, 
              isAuthenticated: true 
            })
            await get().loadUserProfile()
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              set({ 
                user: session.user, 
                session, 
                isAuthenticated: true 
              })
              await get().loadUserProfile()
            } else {
              set({ 
                user: null, 
                profile: null, 
                session: null, 
                isAuthenticated: false 
              })
            }
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
        } finally {
          set({ loading: false })
        }
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        session: state.session,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
