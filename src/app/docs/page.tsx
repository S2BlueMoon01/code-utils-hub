'use client'

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Book, 
  Code2, 
  Rocket, 
  Search,
  Play,
  Users,
  Star,
  Download,
  Copy,
  ExternalLink,
  ArrowRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function DocsPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const quickStartSteps = [
    {
      step: 1,
      title: t('docs.quickStart.step1.title', 'Explore Library'),
      description: t('docs.quickStart.step1.description', 'Browse through thousands of curated utility functions'),
      action: t('docs.quickStart.step1.action', 'View Functions'),
      href: '/utils'
    },
    {
      step: 2,
      title: t('docs.quickStart.step2.title', 'Test on Playground'),
      description: t('docs.quickStart.step2.description', 'Run code directly in your browser'),
      action: t('docs.quickStart.step2.action', 'Open Playground'),
      href: '/playground'
    },
    {
      step: 3,
      title: t('docs.quickStart.step3.title', 'Use in Project'),
      description: t('docs.quickStart.step3.description', 'Copy code or download functions for your project'),
      action: t('docs.quickStart.step3.action', 'Start Using'),
      href: '/utils'
    }
  ]

  const features = [
    {
      icon: Search,
      title: t('docs.features.search.title', 'Advanced Search'),
      description: t('docs.features.search.description', 'Search functions by name, category, language, or tags'),
      details: [
        t('docs.features.search.detail1', 'Fuzzy search with Fuse.js'),
        t('docs.features.search.detail2', 'Filter by language and difficulty'),
        t('docs.features.search.detail3', 'Sort by popularity or date'),
        t('docs.features.search.detail4', 'Real-time search suggestions')
      ]
    },
    {
      icon: Play,
      title: t('docs.features.playground.title', 'Code Playground'),
      description: t('docs.features.playground.description', 'Run and test code directly in browser'),
      details: [
        t('docs.features.playground.detail1', 'Support JavaScript, TypeScript, Python'),
        t('docs.features.playground.detail2', 'Monaco Editor with syntax highlighting'),
        t('docs.features.playground.detail3', 'Live execution and console output'),
        t('docs.features.playground.detail4', 'Share code with URL parameters')
      ]
    },
    {
      icon: Users,
      title: t('docs.features.community.title', 'Community Features'),
      description: t('docs.features.community.description', 'Interact with the developer community'),
      details: [
        t('docs.features.community.detail1', 'Rate and review functions'),
        t('docs.features.community.detail2', 'Comment and discuss'),
        t('docs.features.community.detail3', 'Contribute new functions'),
        t('docs.features.community.detail4', 'User profiles and reputation system')
      ]
    },
    {
      icon: Download,
      title: t('docs.features.export.title', 'Export Options'),
      description: t('docs.features.export.description', 'Multiple ways to use functions'),
      details: [
        t('docs.features.export.detail1', 'Copy to clipboard'),
        t('docs.features.export.detail2', 'Download single file'),
        t('docs.features.export.detail3', 'Export collection'),
        t('docs.features.export.detail4', 'NPM package format')
      ]
    }
  ]

  const codeExamples = {
    javascript: `// Search and use utility functions
import { debounce, formatCurrency } from 'codeutilshub';

// Debounce user input
const debouncedSearch = debounce((query) => {
  searchAPI(query);
}, 300);

// Format currency
const price = formatCurrency(1234.56, 'USD');
console.log(price); // "$1,234.56"`,

    typescript: `// TypeScript support with full type definitions
import { debounce, formatCurrency } from 'codeutilshub';

interface SearchResult {
  id: string;
  title: string;
}

const debouncedSearch = debounce<(query: string) => void>((query) => {
  searchAPI(query);
}, 300);

const price: string = formatCurrency(1234.56, 'USD');`,

    python: `# Python utilities with similar functionality
from codeutilshub import debounce, format_currency

# Debounce decorator
@debounce(0.3)
def search_api(query):
    # API call logic
    pass

# Format currency
price = format_currency(1234.56, 'USD')
print(price)  # "$1,234.56"`
  }

  const apiExamples = [
    {
      title: 'Get Functions List',
      method: 'GET',
      endpoint: '/api/functions',
      description: 'Retrieve paginated list of functions with filters',
      example: `fetch('/api/functions?language=javascript&category=array&page=1')
  .then(res => res.json())
  .then(data => console.log(data.functions));`
    },
    {
      title: 'Search Functions',
      method: 'GET',
      endpoint: '/api/search',
      description: 'Search functions with query and filters',
      example: `fetch('/api/search?q=array+sort&language=typescript')
  .then(res => res.json())
  .then(data => console.log(data.results));`
    },
    {
      title: 'Get Function Details',
      method: 'GET',
      endpoint: '/api/functions/:id',
      description: 'Get detailed information about a specific function',
      example: `fetch('/api/functions/array-unique-by-key')
  .then(res => res.json())
  .then(data => console.log(data.function));`
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          {t('docs.title', 'Documentation')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('docs.subtitle', 'Everything you need to know about CodeUtilsHub')}
        </p>
        
        {/* Search Input */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder={t('docs.search.placeholder', 'Search documentation...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-primary" />
            <span>{t('docs.quickStart.title', 'Quick Start Guide')}</span>
          </CardTitle>
          <CardDescription>
            {t('docs.quickStart.subtitle', 'Start using CodeUtilsHub in 3 simple steps')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {quickStartSteps.map((step) => (
              <div key={step.step} className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={step.href}>
                      {step.action}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Documentation */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="w-5 h-5 text-primary" />
            <span>{t('docs.features.title', 'Main Features')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-muted">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <feature.icon className="w-5 h-5 text-primary" />
                    <span>{feature.title}</span>
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span>{t('docs.examples.title', 'Code Examples')}</span>
          </CardTitle>
          <CardDescription>
            {t('docs.examples.subtitle', 'Usage examples in different languages')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="typescript">TypeScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            
            {Object.entries(codeExamples).map(([lang, code]) => (
              <TabsContent key={lang} value={lang}>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{code}</code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => navigator.clipboard.writeText(code)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            {t('docs.api.title', 'API Reference')}
          </h2>
          <CardDescription>
            {t('docs.api.subtitle', 'REST API endpoints to integrate CodeUtilsHub into your application')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {apiExamples.map((api, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Badge variant="outline" className="font-mono">
                  {api.method}
                </Badge>
                <code className="text-sm font-mono">{api.endpoint}</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{api.description}</p>
              <div className="relative">
                <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                  <code>{api.example}</code>
                </pre>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => navigator.clipboard.writeText(api.example)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span>{t('docs.bestPractices.title', 'Best Practices')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">{t('docs.bestPractices.performance.title', 'Performance Tips')}</h4>
              <ul className="space-y-2 text-sm">
                <li>• {t('docs.bestPractices.performance.tip1', 'Tree-shake functions when importing')}</li>
                <li>• {t('docs.bestPractices.performance.tip2', 'Use lazy loading for playground')}</li>
                <li>• {t('docs.bestPractices.performance.tip3', 'Cache search results when possible')}</li>
                <li>• {t('docs.bestPractices.performance.tip4', 'Debounce search input to reduce API calls')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">{t('docs.bestPractices.quality.title', 'Code Quality')}</h4>
              <ul className="space-y-2 text-sm">
                <li>• {t('docs.bestPractices.quality.tip1', 'Always test functions before using')}</li>
                <li>• {t('docs.bestPractices.quality.tip2', 'Read documentation and examples')}</li>
                <li>• {t('docs.bestPractices.quality.tip3', 'Contribute back if you find bugs')}</li>
                <li>• {t('docs.bestPractices.quality.tip4', 'Follow naming conventions')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            {t('docs.support.title', 'Need More Help?')}
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('docs.support.subtitle', 'Join our Discord community, check GitHub issues, or contact our support team.')}
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" asChild>
              <a href="https://github.com/codeutilshub" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                GitHub Issues
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://discord.gg/codeutilshub" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                Join Discord
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:support@codeutilshub.com">
                <ExternalLink className="w-4 h-4 mr-2" />
                {t('docs.support.emailSupport', 'Email Support')}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
