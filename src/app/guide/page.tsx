'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import {
  BookOpen,
  Code,
  Search,
  Users,
  Heart,
  Sparkles,
  Rocket,
  FileText
} from 'lucide-react';

const guideFeatures = [
  {
    icon: BookOpen,
    title: 'Utility Function Library',
    description: 'Browse and discover curated utility functions',
    features: ['Function categories', 'Detailed documentation', 'Code examples', 'Performance notes'],
    link: '#utility-function-library'
  },
  {
    icon: Code,
    title: 'Code Playground',
    description: 'Interactive coding environment with live execution',
    features: ['Multi-language support', 'Real-time execution', 'Code sharing', 'Template library'],
    link: '#code-playground'
  },
  {
    icon: Search,
    title: 'Search & Discovery',
    description: 'Advanced search with filtering and analytics',
    features: ['Text and code search', 'Advanced filters', 'Popular functions', 'Search history'],
    link: '#search--discovery'
  },
  {
    icon: Users,
    title: 'Community Features',
    description: 'Connect with developers and share knowledge',
    features: ['Rating system', 'Reviews & comments', 'User reputation', 'Contribution recognition'],
    link: '#community-features'
  },
  {
    icon: Heart,
    title: 'Contributing Functions',
    description: 'Share your code with the developer community',
    features: ['Quality guidelines', 'Review process', 'Recognition system', 'Best practices'],
    link: '#contributing-functions'
  },
  {
    icon: Sparkles,
    title: 'Tips & Best Practices',
    description: 'Maximize your productivity with expert tips',
    features: ['Security considerations', 'Performance optimization', 'Platform shortcuts', 'Quality standards'],
    link: '#tips--best-practices'
  }
];

const keyboardShortcuts = [
  { key: 'Ctrl/Cmd + Enter', action: 'Run code in playground' },
  { key: 'Ctrl/Cmd + S', action: 'Save code snippet' },
  { key: 'Ctrl/Cmd + /', action: 'Toggle code comments' },
  { key: 'Ctrl/Cmd + F', action: 'Find in code editor' },
  { key: 'F11', action: 'Toggle fullscreen mode' },
];

export default function UserGuidePage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const guideTitle = t('guide.title', 'CodeUtilsHub User Guide');
  const guideDescription = t('guide.description', 'Master the platform with our comprehensive guide. Learn how to discover functions, use the playground, contribute code, and connect with the developer community.');

  const quickLinks = [
    { title: t('guide.quickLinks.functions', 'Function Library'), href: '/utils', description: t('guide.quickLinks.functionsDesc', 'Browse all functions') },
    { title: t('guide.quickLinks.playground', 'Code Playground'), href: '/playground', description: t('guide.quickLinks.playgroundDesc', 'Interactive coding environment') },
    { title: t('guide.quickLinks.contribute', 'Contribute'), href: '/contribute', description: t('guide.quickLinks.contributeDesc', 'Share your functions') },
    { title: t('guide.quickLinks.api', 'API Documentation'), href: '/docs/api', description: t('guide.quickLinks.apiDesc', 'Developer resources') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-muted py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-primary to-primary/60 rounded-full">
                <BookOpen className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
              {guideTitle}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {guideDescription}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/docs/user-guide">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <FileText className="w-5 h-5 mr-2" />
                  Read Full Guide
                </Button>
              </Link>
              <Link href="/playground">
                <Button variant="outline" size="lg">
                  <Rocket className="w-5 h-5 mr-2" />
                  {t('guide.tryPlayground', 'Try Playground')}
                </Button>
              </Link>
              {!user && (
                <Link href="/auth/signin">
                  <Button size="lg" variant="secondary">
                    {t('auth.getStarted', 'Get Started')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-primary">
                      {link.title}
                    </CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {/* Feature Sections */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Platform Features Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guideFeatures.map((feature) => (
                <Card key={feature.title} className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {feature.features.map((item) => (
                        <li key={item} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/docs/user-guide${feature.link}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-card rounded-xl shadow-lg p-8 mb-16 border">
            <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
              ⚡ Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {keyboardShortcuts.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    {shortcut.action}
                  </span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {shortcut.key}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Help Resources */}
          <div className="text-center bg-muted/50 rounded-xl p-8 border mb-16">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              {t('guide.needHelp')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('guide.helpDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/faq">
                <Button variant="outline">
                  Frequently Asked Questions
                </Button>
              </Link>
              <Link href="/docs/api">
                <Button variant="outline">
                  API Documentation
                </Button>
              </Link>
              <Link href="/docs/developer">
                <Button variant="outline">
                  Developer Guide
                </Button>
              </Link>
            </div>
          </div>

          {/* Getting Started CTA */}
          <div className="text-center p-8 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Jump into the platform and start exploring our utility functions, testing code in the playground, 
              and connecting with fellow developers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/utils">
                <Button size="lg" variant="secondary">
                  Browse Functions
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
