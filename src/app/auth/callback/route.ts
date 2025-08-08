import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=authentication_failed`)
      }

      if (data.user) {
        // Check if user profile exists, create if not
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (!profile) {
          // Create user profile from OAuth data
          const newProfile = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.preferred_username || 
                     data.user.user_metadata?.user_name || 
                     data.user.email?.split('@')[0],
            full_name: data.user.user_metadata?.full_name || 
                      data.user.user_metadata?.name || '',
            avatar_url: data.user.user_metadata?.avatar_url || 
                       data.user.user_metadata?.picture,
            role: 'user',
            reputation: 100,
            contributions_count: 0,
            // OAuth provider specific data
            github_username: data.user.user_metadata?.user_name,
            github_url: data.user.user_metadata?.html_url,
            location: data.user.user_metadata?.location,
            bio: data.user.user_metadata?.bio,
            website: data.user.user_metadata?.blog,
            company: data.user.user_metadata?.company,
            twitter_username: data.user.user_metadata?.twitter_username,
            public_repos: data.user.user_metadata?.public_repos,
            followers: data.user.user_metadata?.followers,
            following: data.user.user_metadata?.following
          }

          await supabase
            .from('user_profiles')
            .insert(newProfile)
        }
      }

      // Redirect to dashboard on successful authentication
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    } catch (error) {
      console.error('Auth callback processing error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=callback_error`)
    }
  }

  // Redirect to signin if no code
  return NextResponse.redirect(`${requestUrl.origin}/auth/signin`)
}
