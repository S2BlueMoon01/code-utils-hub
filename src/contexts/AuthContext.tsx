'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Session, User, AuthError } from '@supabase/supabase-js'
import { supabase, UserProfile, dbHelpers } from '@/lib/supabase'

interface AuthResult {
  data: {
    user: User | null
    session: Session | null
  } | null
  error: AuthError | null
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      const userProfile = await dbHelpers.getUserProfile(userId)
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading user profile:', error)
      // If profile doesn't exist, create a basic one
      if (user) {
        try {
          const newProfile = {
            id: userId,
            email: user.email!,
            username: user.email!.split('@')[0],
            full_name: user.user_metadata?.full_name || '',
            role: 'user' as const,
            reputation: 0,
            contributions_count: 0
          }
          
          const createdProfile = await supabase
            .from('user_profiles')
            .insert(newProfile)
            .select()
            .single()
          
          if (createdProfile.data) {
            setProfile(createdProfile.data as UserProfile)
          }
        } catch (createError) {
          console.error('Error creating user profile:', createError)
        }
      }
    }
  }, [user])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [loadUserProfile])

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    
    const updatedProfile = await dbHelpers.updateUserProfile(user.id, updates)
    setProfile(updatedProfile)
    return updatedProfile
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
