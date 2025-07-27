'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'
import { AuthModal } from '@/components/auth/AuthModal'
import { UserProfile } from '@/components/auth/UserProfile'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Code, 
  User,
  LogIn,
  Github
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showAuthModal, setShowAuthModal] = React.useState(false)
  const [showUserProfile, setShowUserProfile] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const { user, profile, loading } = useAuthStore()

  const navigation = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.search'), href: '/search' },
    { name: t('navigation.utils'), href: '/utils' },
    { name: t('navigation.playground'), href: '/playground' },
    { name: 'Generator', href: '/generator' },
    { name: 'Favorites', href: '/favorites' },
    { name: t('navigation.blog'), href: '/blog' },
    { name: t('navigation.contribute'), href: '/contribute' },
    { name: t('navigation.docs'), href: '/docs' },
    { name: t('navigation.about'), href: '/about' },
    ...(user ? [{ name: t('navigation.dashboard'), href: '/dashboard' }] : [])
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <header className={cn('sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">CodeUtilsHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search.placeholder')}
              className="w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* GitHub Link */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </Link>
          </Button>

          {/* Auth Buttons */}
          {loading ? (
            <div className="hidden md:flex h-8 w-8 animate-pulse bg-muted rounded-full" />
          ) : user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserProfile(true)}
              className="hidden md:flex items-center space-x-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
                <AvatarFallback>
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:inline">{profile?.username}</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="hidden md:flex"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {t('auth.login')}
            </Button>
          )}

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-4 w-4" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search.placeholder')}
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t pt-2 mt-2">
                {user ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setShowUserProfile(true)
                      setIsMenuOpen(false)
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {profile?.username || 'Profile'}
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setShowAuthModal(true)
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    {t('auth.login')}
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showUserProfile} 
        onClose={() => setShowUserProfile(false)} 
      />
    </header>
  )
}
