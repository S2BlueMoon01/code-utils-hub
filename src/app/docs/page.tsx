'use client'

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

export default function DocsPage() {
  const quickStartSteps = [
    {
      step: 1,
      title: 'Khám phá Library',
      description: 'Duyệt qua hàng nghìn utility functions được tuyển chọn',
      action: 'Xem Functions',
      href: '/utils'
    },
    {
      step: 2,
      title: 'Test trên Playground',
      description: 'Chạy thử code trực tiếp trên trình duyệt',
      action: 'Mở Playground',
      href: '/playground'
    },
    {
      step: 3,
      title: 'Sử dụng trong Project',
      description: 'Copy code hoặc download function cho project của bạn',
      action: 'Bắt đầu sử dụng',
      href: '/utils'
    }
  ]

  const features = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Tìm kiếm function theo tên, category, language, hoặc tags',
      details: [
        'Fuzzy search với Fuse.js',
        'Filter theo language và difficulty',
        'Sort theo popularity hoặc date',
        'Search suggestions realtime'
      ]
    },
    {
      icon: Play,
      title: 'Code Playground',
      description: 'Chạy và test code trực tiếp trên browser',
      details: [
        'Support JavaScript, TypeScript, Python',
        'Monaco Editor với syntax highlighting',
        'Live execution và console output',
        'Share code với URL parameters'
      ]
    },
    {
      icon: Users,
      title: 'Community Features',
      description: 'Tương tác với cộng đồng developers',
      details: [
        'Rate và review functions',
        'Comment và thảo luận',
        'Contribute functions mới',
        'User profiles và reputation system'
      ]
    },
    {
      icon: Download,
      title: 'Export Options',
      description: 'Nhiều cách để sử dụng functions',
      details: [
        'Copy to clipboard',
        'Download single file',
        'Export collection',
        'NPM package format'
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
          Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Hướng dẫn toàn diện để sử dụng CodeUtilsHub hiệu quả nhất. 
          Từ cơ bản đến nâng cao, API references và best practices.
        </p>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-primary" />
            <span>Quick Start</span>
          </CardTitle>
          <CardDescription>
            Bắt đầu sử dụng CodeUtilsHub trong 3 bước đơn giản
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="w-5 h-5 text-primary" />
            <span>Tính năng chính</span>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span>Code Examples</span>
          </CardTitle>
          <CardDescription>
            Ví dụ sử dụng trong các ngôn ngữ khác nhau
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
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>
            REST API endpoints để tích hợp CodeUtilsHub vào ứng dụng của bạn
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
            <span>Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Performance Tips</h4>
              <ul className="space-y-2 text-sm">
                <li>• Tree-shake functions khi import</li>
                <li>• Sử dụng lazy loading cho playground</li>
                <li>• Cache search results khi có thể</li>
                <li>• Debounce search input để giảm API calls</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Code Quality</h4>
              <ul className="space-y-2 text-sm">
                <li>• Luôn test functions trước khi sử dụng</li>
                <li>• Đọc documentation và examples</li>
                <li>• Contribute back nếu tìm thấy bugs</li>
                <li>• Follow naming conventions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            Cần hỗ trợ thêm?
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tham gia community Discord, check GitHub issues, hoặc liên hệ team support.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" asChild>
              <a href="https://github.com/codeutilshub" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://discord.gg/codeutilshub" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                Discord
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:support@codeutilshub.com">
                <ExternalLink className="w-4 h-4 mr-2" />
                Email Support
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
