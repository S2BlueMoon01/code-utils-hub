'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Github, 
  Twitter, 
  Linkedin, 
  Globe,
  MapPin,
  Edit,
  Save,
  X
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAnalytics } from '@/lib/analytics'

interface UserProfile {
  id: string
  username: string
  email: string
  fullName: string
  bio: string
  location: string
  website: string
  avatarUrl: string
  socialLinks: {
    github?: string
    twitter?: string
    linkedin?: string
  }
  stats: {
    contributedFunctions: number
    snippetsCreated: number
    likesReceived: number
    reputation: number
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    emailNotifications: boolean
    publicProfile: boolean
  }
  joinedAt: string
  lastActive: string
}

const defaultProfile: Partial<UserProfile> = {
  bio: '',
  location: '',
  website: '',
  socialLinks: {},
  stats: {
    contributedFunctions: 0,
    snippetsCreated: 0,
    likesReceived: 0,
    reputation: 0
  },
  preferences: {
    theme: 'system',
    language: 'en',
    emailNotifications: true,
    publicProfile: true
  }
}

export function UserProfileManager() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const { user } = useAuthStore()
  const { trackEvent } = useAnalytics()

  const loadUserProfile = useCallback(async () => {
    if (!user) return

    try {
      // Mock API call - in production, fetch from your backend
      const mockProfile: UserProfile = {
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
        email: user.email || '',
        fullName: user.user_metadata?.full_name || '',
        avatarUrl: user.user_metadata?.avatar_url || '',
        joinedAt: user.created_at || new Date().toISOString(),
        lastActive: new Date().toISOString(),
        ...defaultProfile
      } as UserProfile

      setProfile(mockProfile)
      setEditedProfile(mockProfile)
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadUserProfile()
    } else {
      setLoading(false)
    }
  }, [user, loadUserProfile])

  const handleSave = async () => {
    if (!profile || !editedProfile) return

    setSaving(true)
    try {
      // Mock API call - in production, save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedProfile = { ...profile, ...editedProfile }
      setProfile(updatedProfile)
      setIsEditing(false)
      
      trackEvent('profile_updated', {
        fields: Object.keys(editedProfile).join(',')
      })
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile || {})
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Sign in to view your profile</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create an account to customize your profile and track your contributions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                <AvatarFallback className="text-xl">
                  {profile.fullName?.charAt(0) || profile.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl font-bold">{profile.fullName || profile.username}</h1>
                <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
                {profile.location && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </div>
                )}
              </div>
            </div>

            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              disabled={saving}
            >
              {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {profile.bio && (
            <p className="text-gray-700 dark:text-gray-300 mb-4">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{profile.stats.contributedFunctions}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Functions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{profile.stats.snippetsCreated}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Snippets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{profile.stats.likesReceived}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{profile.stats.reputation}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reputation</div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-2">
            {profile.website && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                </a>
              </Button>
            )}
            {profile.socialLinks.github && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {profile.socialLinks.twitter && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            )}
            {profile.socialLinks.linkedin && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={editedProfile.fullName || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, fullName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={editedProfile.username || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedProfile.bio || ''}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editedProfile.location || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={editedProfile.website || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, website: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div><strong>Joined:</strong> {new Date(profile.joinedAt).toLocaleDateString()}</div>
                  <div><strong>Last Active:</strong> {new Date(profile.lastActive).toLocaleDateString()}</div>
                  <div><strong>Email:</strong> {profile.email}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Activity tracking coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Settings panel coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contributions">
          <Card>
            <CardHeader>
              <CardTitle>Your Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Contributions history coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
