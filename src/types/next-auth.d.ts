import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string
    provider?: string
    userId?: string
    github?: {
      username?: string
      bio?: string
      location?: string
      blog?: string
      company?: string
      twitter_username?: string
      public_repos?: number
      followers?: number
      following?: number
    }
    google?: {
      given_name?: string
      family_name?: string
      locale?: string
      email_verified?: boolean
    }
  }

  interface User extends DefaultUser {
    username?: string
    bio?: string
    location?: string
    blog?: string
    company?: string
    twitter_username?: string
    public_repos?: number
    followers?: number
    following?: number
    given_name?: string
    family_name?: string
    locale?: string
    email_verified?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    provider?: string
    userId?: string
    github?: {
      username?: string
      bio?: string
      location?: string
      blog?: string
      company?: string
      twitter_username?: string
      public_repos?: number
      followers?: number
      following?: number
    }
    google?: {
      given_name?: string
      family_name?: string
      locale?: string
      email_verified?: boolean
    }
  }
}
