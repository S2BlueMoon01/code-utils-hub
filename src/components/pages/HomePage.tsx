'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
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
    language: 'Python',
    category: 'Validation',
    downloads: 890,
    rating: 4.7,
  }
]

export default function HomePage() {
  const { t, ready } = useTranslation()

  // Show loading until translations are ready
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-muted py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="mr-1 h-3 w-3" />
              {t('home.hero.badge')}
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('home.hero.title')}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/search">
                  <Search className="mr-2 h-4 w-4" />
                  {t('home.hero.cta.explore')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contribute">
                  <Code className="mr-2 h-4 w-4" />
                  {t('home.hero.cta.contribute')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.features.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{t('home.features.search.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('home.features.search.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{t('home.features.playground.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('home.features.playground.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{t('home.features.community.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('home.features.community.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Utils Section */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.featured.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.featured.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredUtils.map((util) => (
              <Card key={util.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{util.name}</CardTitle>
                    <Badge variant="secondary">{util.language}</Badge>
                  </div>
                  <CardDescription>{util.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t('home.featured.stats.downloads', { count: util.downloads })}</span>
                    <span>⭐ {util.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/utils">
                {t('home.featured.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.stats.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.stats.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">{t('home.stats.functions')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">{t('home.stats.developers')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">{t('home.stats.downloads')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">{t('home.stats.languages')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">{t('home.cta.title')}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  {t('home.cta.primary')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">
                  {t('home.cta.secondary')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
