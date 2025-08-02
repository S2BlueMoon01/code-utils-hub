/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://codeutils-hub.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/api/*',
    '/admin/*',
    '/_next/*',
    '/404',
    '/500'
  ],
  additionalPaths: async () => {
    const result = []

    // Add static utility function pages
    const utilityCategories = [
      'string-manipulation',
      'array-operations', 
      'object-utilities',
      'date-formatting',
      'math-calculations',
      'validation-helpers',
      'performance-optimization',
      'browser-utilities'
    ]

    // Add category pages
    utilityCategories.forEach(category => {
      result.push({
        loc: `/utils/${category}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      })
    })

    // Add utility function detail pages (sample)
    const sampleFunctions = [
      'debounce-function',
      'throttle-function', 
      'deep-clone-object',
      'format-date-string',
      'validate-email',
      'array-chunk',
      'string-capitalize',
      'object-merge',
      'calculate-distance',
      'generate-uuid'
    ]

    sampleFunctions.forEach(func => {
      result.push({
        loc: `/utils/${func}`,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      })
    })

    return result
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1
      }
    ],
    additionalSitemaps: [
      'https://codeutils-hub.vercel.app/server-sitemap.xml'
    ]
  },
  transform: async (config, path) => {
    // Custom transformation for specific routes
    const customPriorities = {
      '/': 1.0,
      '/playground': 0.9,
      '/utils': 0.9,
      '/docs': 0.8,
      '/about': 0.7,
      '/search': 0.8,
      '/contribute': 0.6,
      '/dashboard': 0.5,
      '/favorites': 0.5,
      '/analytics': 0.4,
      '/faq': 0.6,
      '/blog': 0.7
    }

    const priority = customPriorities[path] || 0.5

    // Dynamic changefreq based on route type
    let changefreq = 'monthly'
    if (path === '/') changefreq = 'daily'
    else if (path.includes('/playground') || path.includes('/utils')) changefreq = 'weekly'
    else if (path.includes('/blog')) changefreq = 'weekly'

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  }
}
