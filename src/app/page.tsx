import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Code, Search, Users, Zap } from 'lucide-react'

// Sample utility functions for homepage display
const featuredUtils = [
  {
    id: 1,
    name: 'formatDate',
    description: 'Format dates with customizable options and localization support',
    language: 'JavaScript',
    category: 'Date',
    downloads: 1250,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'debounce',
    description: 'Delay function execution to improve performance in user interactions',
    language: 'TypeScript',
    category: 'Performance',
    downloads: 2100,
    rating: 4.9,
  },
  {
    id: 3,
    name: 'validateEmail',
    description: 'Robust email validation with RFC compliance and custom rules',
    language: 'JavaScript',
    category: 'Validation',
    downloads: 850,
    rating: 4.7,
  },
]

const features = [
  {
    icon: Code,
    title: 'Rich Function Library',
    description: 'Curated collection of utility functions for JavaScript, TypeScript, and Python with comprehensive documentation.',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find the perfect utility with our intelligent search that understands context and function behavior.',
  },
  {
    icon: Zap,
    title: 'Live Playground',
    description: 'Test and experiment with utilities in real-time using our integrated code playground.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Contribute your own utilities, rate others, and build better software together.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-6">
            Build Better Code with
            <span className="text-primary block">CodeUtilsHub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover, test, and integrate powerful utility functions. 
            Our platform provides a comprehensive library of well-tested utilities 
            with an interactive playground for seamless development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/utils">
                Explore Utils Library
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/playground">Try Playground</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need for Better Development
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From utility discovery to testing and integration, 
              CodeUtilsHub streamlines your development workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Utilities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Utilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Popular and highly-rated utilities used by developers worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredUtils.map((util) => (
              <Card key={util.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-mono">{util.name}</CardTitle>
                    <Badge variant="secondary">{util.language}</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {util.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {util.category}
                      </Badge>
                      {util.downloads.toLocaleString()} downloads
                    </span>
                    <span>★ {util.rating}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-4" 
                    asChild
                  >
                    <Link href={`/utils/${util.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/utils">
                View All Utilities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Accelerate Your Development?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers who trust CodeUtilsHub for their utility needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/playground">Start Coding Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contribute">Contribute Utilities</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
