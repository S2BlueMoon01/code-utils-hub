import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpenIcon,
  CodeBracketIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  HeartIcon,
  SparklesIcon,
  RocketLaunchIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'User Guide - CodeUtilsHub',
  description: 'Complete guide to using CodeUtilsHub platform features, from browsing utilities to contributing code.',
  keywords: ['user guide', 'documentation', 'tutorial', 'how to use', 'CodeUtilsHub'],
};

const guideFeatures = [
  {
    icon: BookOpenIcon,
    title: 'Utility Function Library',
    description: 'Browse and discover curated utility functions',
    features: ['Function categories', 'Detailed documentation', 'Code examples', 'Performance notes'],
    link: '#utility-function-library'
  },
  {
    icon: CodeBracketIcon,
    title: 'Code Playground',
    description: 'Interactive coding environment with live execution',
    features: ['Multi-language support', 'Real-time execution', 'Code sharing', 'Template library'],
    link: '#code-playground'
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Search & Discovery',
    description: 'Advanced search with filtering and analytics',
    features: ['Text and code search', 'Advanced filters', 'Popular functions', 'Search history'],
    link: '#search--discovery'
  },
  {
    icon: UserGroupIcon,
    title: 'Community Features',
    description: 'Connect with developers and share knowledge',
    features: ['Rating system', 'Reviews & comments', 'User reputation', 'Contribution recognition'],
    link: '#community-features'
  },
  {
    icon: HeartIcon,
    title: 'Contributing Functions',
    description: 'Share your code with the developer community',
    features: ['Quality guidelines', 'Review process', 'Recognition system', 'Best practices'],
    link: '#contributing-functions'
  },
  {
    icon: SparklesIcon,
    title: 'Tips & Best Practices',
    description: 'Maximize your productivity with expert tips',
    features: ['Security considerations', 'Performance optimization', 'Platform shortcuts', 'Quality standards'],
    link: '#tips--best-practices'
  }
];

const quickLinks = [
  { title: 'Function Library', href: '/utils', description: 'Browse all functions' },
  { title: 'Code Playground', href: '/playground', description: 'Interactive coding environment' },
  { title: 'Contribute', href: '/contribute', description: 'Share your functions' },
  { title: 'API Documentation', href: '/docs/api', description: 'Developer resources' },
];

const keyboardShortcuts = [
  { key: 'Ctrl/Cmd + Enter', action: 'Run code in playground' },
  { key: 'Ctrl/Cmd + S', action: 'Save code snippet' },
  { key: 'Ctrl/Cmd + /', action: 'Toggle code comments' },
  { key: 'Ctrl/Cmd + F', action: 'Find in code editor' },
  { key: 'F11', action: 'Toggle fullscreen mode' },
];

export default function UserGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <BookOpenIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            CodeUtilsHub User Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Master the platform with our comprehensive guide. Learn how to discover functions, 
            use the playground, contribute code, and connect with the developer community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/docs/USER_GUIDE.md">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Read Full Guide
              </Button>
            </Link>
            <Link href="/playground">
              <Button variant="outline" size="lg">
                <RocketLaunchIcon className="w-5 h-5 mr-2" />
                Try Playground
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-blue-600 dark:text-blue-400">
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
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
            Platform Features Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guideFeatures.map((feature) => (
              <Card key={feature.title} className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
                      <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                      <li key={item} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/docs/USER_GUIDE.md${feature.link}`}>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
            ⚡ Keyboard Shortcuts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyboardShortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">
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
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-purple-900 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Need More Help?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Explore our comprehensive documentation, join the community, or check out the FAQ section 
            for answers to common questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/faq">
              <Button variant="outline">
                Frequently Asked Questions
              </Button>
            </Link>
            <Link href="/docs/API.md">
              <Button variant="outline">
                API Documentation
              </Button>
            </Link>
            <Link href="/docs/DEVELOPER.md">
              <Button variant="outline">
                Developer Guide
              </Button>
            </Link>
          </div>
        </div>

        {/* Getting Started CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
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
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
