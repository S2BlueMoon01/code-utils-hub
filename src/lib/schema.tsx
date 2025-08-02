import { getBaseUrl, createAbsoluteUrl } from './url-utils'

export interface SchemaProps {
  type: 'website' | 'organization' | 'breadcrumb' | 'software' | 'article'
  data?: {
    title?: string
    description?: string
    author?: string
    datePublished?: string
    dateModified?: string
    url?: string
    items?: Array<{ name: string; url: string }>
    [key: string]: unknown
  }
}

export function generateSchema({ type, data }: SchemaProps): string {
  let schema: Record<string, unknown> = {}
  const baseUrl = getBaseUrl()

  switch (type) {
    case 'website':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CodeUtilsHub',
        description: 'A modern platform for developers with utility functions library and interactive code playground',
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        },
        author: {
          '@type': 'Organization',
          name: 'CodeUtilsHub Team'
        }
      }
      break

    case 'organization':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CodeUtilsHub',
        description: 'Modern developer tools and utilities platform',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: [
          'https://github.com/S2BlueMoon01/code-utils-hub'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'support',
          email: 'support@codeutils-hub.com'
        }
      }
      break

    case 'software':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'CodeUtilsHub',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        description: 'Interactive code playground and utility functions library for developers',
        url: baseUrl,
        screenshot: `${baseUrl}/screenshot.png`,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        author: {
          '@type': 'Organization',
          name: 'CodeUtilsHub Team'
        },
        featureList: [
          'Code Playground with Monaco Editor',
          'Multi-language Code Execution',
          'Utility Functions Library',
          'Code Snippet Management',
          'Advanced Code Editor',
          'Community Features'
        ]
      }
      break

    case 'breadcrumb':
      if (!data?.items) break
      schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item: { name: string; url: string }, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      }
      break

    case 'article':
      if (!data) break
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Person',
          name: data.author || 'CodeUtilsHub Team'
        },
        publisher: {
          '@type': 'Organization',
          name: 'CodeUtilsHub',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url
        }
      }
      break

    default:
      return ''
  }

  return JSON.stringify(schema, null, 2)
}

export function SchemaMarkup({ type, data }: SchemaProps) {
  const schemaJson = generateSchema({ type, data })
  
  if (!schemaJson) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaJson }}
    />
  )
}
