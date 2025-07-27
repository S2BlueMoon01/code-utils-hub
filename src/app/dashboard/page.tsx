'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { sampleUtilityFunctions } from '@/data/sample-functions'
import { UtilityFunction } from '@/types'
import { 
  User, 
  Trophy, 
  Star, 
  Eye, 
  MessageCircle, 
  Code2, 
  Plus,
  Award,
  BookOpen,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface UserStats {
  functionsCreated: number
  totalViews: number
  totalRating: number
  totalComments: number
  totalLikes: number
  reputation: number
  level: number
  xp: number
  nextLevelXp: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface ActivityItem {
  type: string
  title: string
  date: string
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [userStats, setUserStats] = useState<UserStats>({
    functionsCreated: 0,
    totalViews: 0,
    totalRating: 0,
    totalComments: 0,
    totalLikes: 0,
    reputation: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 100
  })
  const [userFunctions, setUserFunctions] = useState<UtilityFunction[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const loadUserData = useCallback(async () => {
    if (!user) return
    
    // In real app, fetch from Supabase
    // For demo, simulate data
    const userCreatedFunctions = sampleUtilityFunctions.filter(f => f.author.id === user.id)
    setUserFunctions(userCreatedFunctions)

    // Calculate stats
    const stats: UserStats = {
      functionsCreated: userCreatedFunctions.length,
      totalViews: userCreatedFunctions.reduce((sum, f) => sum + (f.usage_count || 0), 0),
      totalRating: userCreatedFunctions.reduce((sum, f) => sum + (f.rating || 0), 0),
      totalComments: userCreatedFunctions.reduce((sum, f) => sum + (f.comments_count || 0), 0),
      totalLikes: userCreatedFunctions.reduce((sum, f) => sum + (f.likes_count || 0), 0),
      reputation: 500 + Math.floor(Math.random() * 500), // Mock data
      level: Math.floor(Math.random() * 10) + 1,
      xp: Math.floor(Math.random() * 80) + 20,
      nextLevelXp: 100
    }
    setUserStats(stats)

    // Mock recent activity
    setRecentActivity([
      { type: 'function_created', title: 'Tạo function mới: "Format Currency"', date: '2 giờ trước' },
      { type: 'comment_received', title: 'Nhận comment mới từ @user123', date: '5 giờ trước' },
      { type: 'rating_received', title: 'Nhận rating 5 sao cho "Validate Email"', date: '1 ngày trước' },
      { type: 'achievement', title: 'Đạt thành tựu "Creator Badge"', date: '2 ngày trước' }
    ])

    // Mock achievements
    setAchievements([
      { id: '1', title: 'First Function', description: 'Tạo function đầu tiên', icon: '🚀', unlocked: true, unlockedAt: '2024-01-15' },
      { id: '2', title: 'Popular Creator', description: 'Function có hơn 100 lượt xem', icon: '🔥', unlocked: true, unlockedAt: '2024-01-20' },
      { id: '3', title: 'Community Helper', description: 'Nhận 10 bình luận tích cực', icon: '🤝', unlocked: false },
      { id: '4', title: 'Code Master', description: 'Tạo 10 functions', icon: '👨‍💻', unlocked: false },
      { id: '5', title: 'Star Collector', description: 'Tổng rating 50 sao', icon: '⭐', unlocked: false }
    ])
  }, [user])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user, loadUserData])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Đăng nhập để xem Dashboard</h3>
            <p className="text-muted-foreground">
              Bạn cần đăng nhập để truy cập trang dashboard cá nhân
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.user_metadata?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user?.user_metadata?.display_name || user?.email || 'User'}</h1>
            <p className="text-muted-foreground">Level {userStats.level} • {userStats.reputation} Reputation</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>XP Progress</span>
            <span>{userStats.xp} / {userStats.nextLevelXp}</span>
          </div>
          <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="h-2" />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="achievements">Thành tựu</TabsTrigger>
          <TabsTrigger value="activity">Hoạt động</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Functions Created</CardTitle>
                <Code2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.functionsCreated}</div>
                <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.totalViews}</div>
                <p className="text-xs text-muted-foreground">+180 từ tuần trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.functionsCreated > 0 ? (userStats.totalRating / userStats.functionsCreated).toFixed(1) : '0.0'}
                </div>
                <p className="text-xs text-muted-foreground">Từ {userStats.functionsCreated} functions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reputation</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.reputation}</div>
                <p className="text-xs text-muted-foreground">Rank: Top 10%</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/contribute">
                  <Button className="w-full h-20 flex flex-col gap-2">
                    <Plus className="w-6 h-6" />
                    Tạo Function Mới
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <BookOpen className="w-6 h-6" />
                    Khám phá Functions
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Settings className="w-6 h-6" />
                  Cài đặt Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Functions Tab */}
        <TabsContent value="functions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Functions của bạn ({userFunctions.length})</h2>
            <Link href="/contribute">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tạo mới
              </Button>
            </Link>
          </div>

          {userFunctions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có function nào</h3>
                <p className="text-muted-foreground mb-4">
                  Bắt đầu đóng góp bằng cách tạo function đầu tiên
                </p>
                <Link href="/contribute">
                  <Button>Tạo Function Đầu Tiên</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userFunctions.map((func) => (
                <Card key={func.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{func.name}</CardTitle>
                      <Badge variant="secondary">{func.category}</Badge>
                    </div>
                    <CardDescription>{func.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{func.usage_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{func.rating || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{func.comments_count || 0}</span>
                        </div>
                      </div>
                      <Link href={`/utils/${func.id}`}>
                        <Button size="sm" variant="outline">Xem chi tiết</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <h2 className="text-xl font-semibold">Thành tựu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.unlocked ? 'border-green-200 bg-green-50' : 'opacity-60'}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {achievement.unlocked && achievement.unlockedAt && (
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Award className="w-4 h-4" />
                      <span>Đạt được ngày {new Date(achievement.unlockedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <h2 className="text-xl font-semibold">Hoạt động gần đây</h2>
          <Card>
            <CardContent className="p-0">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
