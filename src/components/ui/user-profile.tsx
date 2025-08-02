'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { Input } from './input'
import { Textarea } from './textarea'
import { Label } from './label'
import { 
  User, 
  Settings, 
  Star, 
  Code, 
  Heart, 
  Calendar,
  Trophy,
  Edit3,
  Save,
  X,
  Github,
  Twitter,
  Linkedin,
  Globe
} from 'lucide-react'

interface UserStats {
  contributions: number
  favorites: number
  reputation: number
  joinDate: string
  totalViews: number
  averageRating: number
}

interface ContributionHistory {
  id: string
  title: string
  language: string
  category: string
  views: number
  rating: number
  createdAt: string
  status: 'approved' | 'pending' | 'rejected'
}

interface UserProfileProps {
  userId?: string
  isOwnProfile?: boolean
}

export function UserProfile({ userId, isOwnProfile = false }: UserProfileProps) {
  const { user, profile, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    bio: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: ''
  })

  const [userStats] = useState<UserStats>({
    contributions: 23,
    favorites: 45,
    reputation: 1250,
    joinDate: '2024-01-15',
    totalViews: 15420,
    averageRating: 4.6
  })

  const [contributions] = useState<ContributionHistory[]>([
    {
      id: '1',
      title: 'Advanced Debounce Function',
      language: 'typescript',
      category: 'Performance',
      views: 1250,
      rating: 4.8,
      createdAt: '2024-01-20',
      status: 'approved'
    },
    {
      id: '2', 
      title: 'Deep Object Merge Utility',
      language: 'javascript',
      category: 'Object Utilities',
      views: 890,
      rating: 4.5,
      createdAt: '2024-01-18',
      status: 'approved'
    },
    {
      id: '3',
      title: 'Email Validation with Custom Rules',
      language: 'javascript',
      category: 'Validation',
      views: 650,
      rating: 4.2,
      createdAt: '2024-01-15',
      status: 'pending'
    }
  ])

  useEffect(() => {
    if (profile) {
      setEditData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: '',
        location: '',
        website: '',
        github: '',
        twitter: '',
        linkedin: ''
      })
    }
  }, [profile])

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        username: editData.username,
        full_name: editData.full_name
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const getStatusColor = (status: ContributionHistory['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getLanguageColor = (language: string) => {
    const colors = {
      javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      python: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      java: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    }
    return colors[language as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  if (!user && !userId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please sign in to view your profile</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-lg">
                {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editData.full_name}
                      onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editData.username}
                      onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      onClick={() => setIsEditing(false)} 
                      variant="outline" 
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{profile?.full_name || profile?.username}</h1>
                    {isOwnProfile && (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        variant="ghost" 
                        size="sm"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">@{profile?.username}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(userStats.joinDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {userStats.reputation} reputation
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Code className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{userStats.contributions}</div>
            <div className="text-sm text-muted-foreground">Contributions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{userStats.favorites}</div>
            <div className="text-sm text-muted-foreground">Favorites</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{userStats.averageRating}</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{userStats.totalViews.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="contributions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="contributions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contributions.map((contribution) => (
                  <div key={contribution.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{contribution.title}</h3>
                      <Badge className={getStatusColor(contribution.status)}>
                        {contribution.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getLanguageColor(contribution.language)}>
                        {contribution.language}
                      </Badge>
                      <Badge variant="outline">{contribution.category}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{contribution.views} views</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {contribution.rating}
                      </div>
                      <span>{new Date(contribution.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Functions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your favorite utility functions will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Your location"
                    value={editData.location}
                    onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                      <Globe className="h-4 w-4" />
                    </div>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={editData.website}
                      onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                      <Github className="h-4 w-4" />
                    </div>
                    <Input
                      id="github"
                      placeholder="github.com/username"
                      value={editData.github}
                      onChange={(e) => setEditData(prev => ({ ...prev, github: e.target.value }))}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
              
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
