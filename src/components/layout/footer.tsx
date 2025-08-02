'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Code, Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const { t } = useTranslation()
  const [email, setEmail] = React.useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    console.log('Subscribe email:', email)
    setEmail('')
  }

  const footerLinks = {
    product: [
      { name: t('footer.product.utils'), href: '/utils' },
      { name: t('footer.product.playground'), href: '/playground' },
      { name: t('footer.product.api'), href: '/api' },
      { name: t('footer.product.pricing'), href: '/pricing' },
    ],
    community: [
      { name: t('footer.community.contribute'), href: '/contribute' },
      { name: t('footer.community.guidelines'), href: '/guidelines' },
      { name: t('footer.community.discord'), href: '#', external: true },
      { name: t('footer.community.forum'), href: '#', external: true },
    ],
    resources: [
      { name: t('footer.resources.documentation'), href: '/docs' },
      { name: t('footer.resources.blog'), href: '/blog' },
      { name: t('footer.resources.tutorials'), href: '/tutorials' },
      { name: t('footer.resources.examples'), href: '/examples' },
    ],
    company: [
      { name: t('footer.company.about'), href: '/about' },
      { name: t('footer.company.privacy'), href: '/privacy' },
      { name: t('footer.company.terms'), href: '/terms' },
      { name: t('footer.company.contact'), href: '/contact' },
    ],
  }

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  ]

  return (
    <footer className={cn('border-t bg-background', className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand and Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Code className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CodeUtilsHub</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {t('footer.description')}
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('footer.newsletter.title')}</p>
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" size="sm">
                  {t('footer.newsletter.subscribe')}
                </Button>
              </form>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t('footer.sections.product')}</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t('footer.sections.community')}</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {link.name}
                    {link.external && <ExternalLink className="ml-1 h-3 w-3" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t('footer.sections.resources')}</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-4">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                variant="ghost"
                size="icon"
                asChild
              >
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              </Button>
            ))}
            <Button variant="ghost" size="icon" asChild>
              <Link href="mailto:contact@codeutilshub.com" aria-label="Email">
                <Mail className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
