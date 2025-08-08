'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useReputationStore, Badge as BadgeType } from '@/stores/reputationStore'
import { useAuthStore } from '@/stores/authStore'
import { 
  Trophy, 
  Star, 
  Award, 
  Calendar,
  User,
  Users,
  Target,
  Crown,
  Flame
} from 'lucide-react'

export function ReputationDashboard() {
  const { user } = useAuthStore()
  const { 
    getUserReputation, 
    getUserLevel, 
    getEarnedBadges, 
    getNextBadges,
    getLeaderboard,
    awardPoints,
    updateStreak
  } = useReputationStore()
  
  const [reputation, setReputation] = useState(getUserReputation(user?.id || ''))
  const [userLevel, setUserLevel] = useState(getUserLevel(user?.id || ''))
  const [earnedBadges, setEarnedBadges] = useState<BadgeType[]>(getEarnedBadges(user?.id || ''))
  const [nextBadges, setNextBadges] = useState<(BadgeType & { progress?: number })[]>(getNextBadges(user?.id || ''))
  const [leaderboard, setLeaderboard] = useState(getLeaderboard(10))

  useEffect(() => {
    if (user?.id) {
      // Update streak on component mount
      updateStreak(user.id)
      
      // Refresh data
      setReputation(getUserReputation(user.id))
      setUserLevel(getUserLevel(user.id))
      setEarnedBadges(getEarnedBadges(user.id))
      setNextBadges(getNextBadges(user.id))
      setLeaderboard(getLeaderboard(10))
    }
  }, [user?.id, updateStreak, getUserReputation, getUserLevel, getEarnedBadges, getNextBadges, getLeaderboard])

  const calculateLevelProgress = () => {
    const currentPoints = reputation.totalPoints
    const levelMin = userLevel.minPoints
    const levelMax = userLevel.maxPoints === Infinity ? levelMin + 1000 : userLevel.maxPoints
    
    if (levelMax === Infinity) return 100
    
    const progress = ((currentPoints - levelMin) / (levelMax - levelMin)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN')
  }

  const getBadgeColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      gold: 'bg-yellow-600',
      gray: 'bg-gray-500'
    }
    return colors[color] || 'bg-gray-500'
  }

  const handleTestAction = (action: 'function_created' | 'function_liked' | 'helpful_review') => {
    if (user?.id) {
      const metadata = {
        functionName: 'Test Function ' + Date.now()
      }
      awardPoints(user.id, action, metadata)
      
      // Refresh data
      setReputation(getUserReputation(user.id))
      setUserLevel(getUserLevel(user.id))
      setEarnedBadges(getEarnedBadges(user.id))
      setNextBadges(getNextBadges(user.id))
      setLeaderboard(getLeaderboard(10))
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sign in to view reputation</h3>
          <p className="text-muted-foreground">
            Create an account to start earning reputation points and badges
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reputation & Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and earn badges for your contributions
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{reputation.totalPoints.toLocaleString()}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{userLevel.level}</p>
                <p className="text-xs text-muted-foreground">{userLevel.title}</p>
              </div>
              <Crown className={`h-8 w-8 text-${userLevel.color}-500`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Badges</p>
                <p className="text-2xl font-bold">{earnedBadges.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{reputation.streak}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Level Progress</h3>
              <p className="text-sm text-muted-foreground">
                {userLevel.title} - Level {userLevel.level}
              </p>
            </div>
            <Badge variant="outline" className={getBadgeColor(userLevel.color)}>
              {reputation.totalPoints} / {userLevel.maxPoints === Infinity ? '∞' : userLevel.maxPoints} points
            </Badge>
          </div>
          <Progress value={calculateLevelProgress()} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{userLevel.minPoints} points</span>
            <span>{userLevel.maxPoints === Infinity ? 'Max Level' : `${userLevel.maxPoints} points`}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="badges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="test">Test Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-6">
          {/* Earned Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Earned Badges ({earnedBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {earnedBadges.map((badge) => (
                  <div key={badge.id} className="p-4 border rounded-lg text-center">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="font-semibold text-sm">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                  </div>
                ))}
                {earnedBadges.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-8">
                    No badges earned yet. Start contributing to earn your first badge!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Next Badges to Earn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextBadges.map((badge) => (
                  <div key={badge.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{badge.name}</h4>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.min(badge.progress || 0, badge.requirement)} / {badge.requirement}</span>
                      </div>
                      <Progress 
                        value={((badge.progress || 0) / badge.requirement) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reputation.achievements
                  .slice(-10)
                  .reverse()
                  .map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{achievement.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTimestamp(achievement.timestamp)}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        +{achievement.points} points
                      </Badge>
                    </div>
                  ))}
                {reputation.achievements.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No achievements yet. Start contributing to earn points!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Contributors
              </CardTitle>
              <CardDescription>
                Community leaderboard based on reputation points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map(({ userId, reputation: userRep, level }, index) => (
                  <div key={userId} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">User {userId.slice(0, 8)}...</p>
                      <p className="text-sm text-muted-foreground">{level.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{userRep.totalPoints.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No users in leaderboard yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
              <CardDescription>
                Test the reputation system by simulating various actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button onClick={() => handleTestAction('function_created')}>
                  Create Function (+10 points)
                </Button>
                <Button onClick={() => handleTestAction('function_liked')}>
                  Receive Like (+3 points)
                </Button>
                <Button onClick={() => handleTestAction('helpful_review')}>
                  Helpful Review (+5 points)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
