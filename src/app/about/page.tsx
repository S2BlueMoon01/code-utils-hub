'use client'

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Code, 
  Users, 
  Star, 
  Target, 
  Heart, 
  Zap, 
  Shield, 
  Globe,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const { t } = useTranslation()
  
  const teamMembers = [
    {
      name: t('about.team.members.member1.name'),
      role: t('about.team.members.member1.role'),
      avatar: '/avatars/member1.jpg',
      bio: t('about.team.members.member1.bio'),
      social: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com'
      }
    },
    {
      name: t('about.team.members.member2.name'),
      role: t('about.team.members.member2.role'),
      avatar: '/avatars/member2.jpg',
      bio: t('about.team.members.member2.bio'),
      social: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com'
      }
    },
    {
      name: t('about.team.members.member3.name'),
      role: t('about.team.members.member3.role'),
      avatar: '/avatars/member3.jpg',
      bio: t('about.team.members.member3.bio'),
      social: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com'
      }
    }
  ]

  const stats = [
    { label: t('about.stats.activeUsers'), value: '10,000+', icon: Users },
    { label: t('about.stats.functions'), value: '500+', icon: Code },
    { label: t('about.stats.communityRating'), value: '4.9/5', icon: Star },
    { label: t('about.stats.countries'), value: '50+', icon: Globe }
  ]

  const values = [
    {
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description'),
      icon: Star
    },
    {
      title: t('about.values.community.title'),
      description: t('about.values.community.description'),
      icon: Users
    },
    {
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      icon: Zap
    },
    {
      title: t('about.values.transparency.title'),
      description: t('about.values.transparency.description'),
      icon: Shield
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('about.subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t('about.mission.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('about.mission.description')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              {t('about.vision.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('about.vision.description')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">{t('about.values.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">{t('about.team.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-2">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={member.social.github} target="_blank">
                      <Github className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={member.social.twitter} target="_blank">
                      <Twitter className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={member.social.linkedin} target="_blank">
                      <Linkedin className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-center">{t('about.tech.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('about.tech.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 
              'Supabase', 'Vercel', 'Node.js', 'PostgreSQL'
            ].map((tech) => (
              <div key={tech} className="text-center">
                <Badge variant="outline" className="w-full py-2">
                  {tech}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact/CTA */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4">{t('about.cta.title')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contribute">
              <Button size="lg">
                <Code className="w-4 h-4 mr-2" />
                {t('about.cta.contribute')}
              </Button>
            </Link>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com" target="_blank">
                <Github className="w-4 h-4 mr-2" />
                {t('about.cta.github')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:contact@codeutilshub.com">
                <Mail className="w-4 h-4 mr-2" />
                {t('about.cta.contact')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
