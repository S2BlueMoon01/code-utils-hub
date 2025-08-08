/**
 * Environment Configuration
 * Manages environment variables and feature flags across different environments
 */

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'staging' | 'test'
  APP_URL: string
  API_URL: string
  
  // Database
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  
  // Authentication
  NEXTAUTH_URL?: string
  NEXTAUTH_SECRET?: string
  
  // OAuth
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  
  // Analytics
  GA_MEASUREMENT_ID?: string
  
  // External APIs
  JUDGE0_API_URL?: string
  JUDGE0_API_KEY?: string
  
  // Error Monitoring
  SENTRY_DSN?: string
  PUBLIC_SENTRY_DSN?: string
  
  // Feature Flags
  ENABLE_ANALYTICS: boolean
  ENABLE_OAUTH: boolean
  ENABLE_CODE_EXECUTION: boolean
  ENABLE_REPUTATION_SYSTEM: boolean
  
  // Rate Limiting
  RATE_LIMIT_REQUESTS_PER_MINUTE: number
  
  // Debug
  DEBUG_MODE: boolean
}

class EnvironmentManager {
  private config: EnvironmentConfig

  constructor() {
    this.config = this.loadConfig()
  }

  private loadConfig(): EnvironmentConfig {
    return {
      NODE_ENV: (process.env.NODE_ENV as EnvironmentConfig['NODE_ENV']) || 'development',
      APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      
      // Database
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      
      // Authentication
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      
      // OAuth
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      
      // Analytics
      GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      
      // External APIs
      JUDGE0_API_URL: process.env.JUDGE0_API_URL,
      JUDGE0_API_KEY: process.env.JUDGE0_API_KEY,
      
      // Error Monitoring
      SENTRY_DSN: process.env.SENTRY_DSN,
      PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Feature Flags
      ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
      ENABLE_OAUTH: process.env.NEXT_PUBLIC_ENABLE_OAUTH === 'true',
      ENABLE_CODE_EXECUTION: process.env.NEXT_PUBLIC_ENABLE_CODE_EXECUTION === 'true',
      ENABLE_REPUTATION_SYSTEM: process.env.NEXT_PUBLIC_ENABLE_REPUTATION_SYSTEM === 'true',
      
      // Rate Limiting
      RATE_LIMIT_REQUESTS_PER_MINUTE: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '60', 10),
      
      // Debug
      DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
    }
  }

  // Getters for different configuration categories
  get database() {
    return {
      url: this.config.SUPABASE_URL,
      anonKey: this.config.SUPABASE_ANON_KEY
    }
  }

  get auth() {
    return {
      url: this.config.NEXTAUTH_URL,
      secret: this.config.NEXTAUTH_SECRET,
      github: {
        clientId: this.config.GITHUB_CLIENT_ID,
        clientSecret: this.config.GITHUB_CLIENT_SECRET
      },
      google: {
        clientId: this.config.GOOGLE_CLIENT_ID,
        clientSecret: this.config.GOOGLE_CLIENT_SECRET
      }
    }
  }

  get features() {
    return {
      analytics: this.config.ENABLE_ANALYTICS,
      oauth: this.config.ENABLE_OAUTH,
      codeExecution: this.config.ENABLE_CODE_EXECUTION,
      reputationSystem: this.config.ENABLE_REPUTATION_SYSTEM
    }
  }

  get app() {
    return {
      env: this.config.NODE_ENV,
      url: this.config.APP_URL,
      apiUrl: this.config.API_URL,
      debug: this.config.DEBUG_MODE
    }
  }

  get external() {
    return {
      judge0: {
        url: this.config.JUDGE0_API_URL,
        key: this.config.JUDGE0_API_KEY
      },
      analytics: {
        gaMeasurementId: this.config.GA_MEASUREMENT_ID
      },
      sentry: {
        dsn: this.config.SENTRY_DSN,
        publicDsn: this.config.PUBLIC_SENTRY_DSN
      }
    }
  }

  get rateLimit() {
    return {
      requestsPerMinute: this.config.RATE_LIMIT_REQUESTS_PER_MINUTE
    }
  }

  // Environment checks
  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development'
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === 'production'
  }

  isStaging(): boolean {
    return this.config.NODE_ENV === 'staging'
  }

  isTest(): boolean {
    return this.config.NODE_ENV === 'test'
  }

  // Feature flag checks
  isFeatureEnabled(feature: keyof EnvironmentConfig): boolean {
    return Boolean(this.config[feature])
  }

  // Validation
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Required environment variables
    if (!this.config.SUPABASE_URL) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL is required')
    }
    if (!this.config.SUPABASE_ANON_KEY) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
    }

    // Production-specific validations
    if (this.isProduction()) {
      if (!this.config.NEXTAUTH_SECRET) {
        errors.push('NEXTAUTH_SECRET is required in production')
      }
      if (this.config.ENABLE_OAUTH && !this.config.GITHUB_CLIENT_ID) {
        errors.push('GITHUB_CLIENT_ID is required when OAuth is enabled')
      }
      if (this.config.ENABLE_ANALYTICS && !this.config.GA_MEASUREMENT_ID) {
        errors.push('NEXT_PUBLIC_GA_MEASUREMENT_ID is required when analytics is enabled')
      }
    }

    // OAuth validations
    if (this.config.ENABLE_OAUTH) {
      if (this.config.GITHUB_CLIENT_ID && !this.config.GITHUB_CLIENT_SECRET) {
        errors.push('GITHUB_CLIENT_SECRET is required when GITHUB_CLIENT_ID is set')
      }
      if (this.config.GOOGLE_CLIENT_ID && !this.config.GOOGLE_CLIENT_SECRET) {
        errors.push('GOOGLE_CLIENT_SECRET is required when GOOGLE_CLIENT_ID is set')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Get all configuration (useful for debugging)
  getAllConfig(): EnvironmentConfig {
    return { ...this.config }
  }

  // Get safe configuration (without secrets, for client-side)
  getSafeConfig() {
    return {
      env: this.config.NODE_ENV,
      appUrl: this.config.APP_URL,
      apiUrl: this.config.API_URL,
      features: this.features,
      debug: this.config.DEBUG_MODE
    }
  }
}

// Export singleton instance
export const env = new EnvironmentManager()

// Export for testing
export { EnvironmentManager }

// Utility function to check if we're in client side
export const isClient = typeof window !== 'undefined'

// Utility function to check if we're in server side
export const isServer = typeof window === 'undefined'

// Environment-specific console logging
export const logger = {
  debug: (...args: unknown[]) => {
    if (env.isDevelopment() || env.app.debug) {
      console.debug('[DEBUG]', ...args)
    }
  },
  info: (...args: unknown[]) => {
    console.info('[INFO]', ...args)
  },
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args)
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args)
  }
}
