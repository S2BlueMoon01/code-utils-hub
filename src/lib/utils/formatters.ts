/**
 * Format a number with consistent formatting
 * Avoids hydration issues by using deterministic formatting
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Format downloads count with "downloads" suffix
 */
export function formatDownloads(count: number): string {
  return `${formatNumber(count)} downloads`
}

/**
 * Format rating with star emoji
 */
export function formatRating(rating: number): string {
  return `⭐ ${rating}`
}
