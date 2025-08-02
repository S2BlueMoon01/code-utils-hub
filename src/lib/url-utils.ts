/**
 * Get the base URL for the application
 * Used for absolute URLs in sitemap, schema, and other SEO purposes
 */
export function getBaseUrl(): string {
  // For server-side rendering, use environment variables
  if (typeof window === 'undefined') {
    return process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }
  
  // For client-side, use window.location
  return window.location.origin
}

/**
 * Create an absolute URL from a relative path
 */
export function createAbsoluteUrl(path: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * Get the current environment
 */
export function getEnvironment(): 'development' | 'production' | 'preview' {
  if (process.env.NODE_ENV === 'development') return 'development'
  if (process.env.VERCEL_ENV === 'production') return 'production'
  return 'preview'
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production'
}
