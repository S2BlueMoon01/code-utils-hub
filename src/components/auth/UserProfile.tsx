'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Star, 
  Code, 
  Calendar,
  Edit3,
  LogOut
} from 'lucide-react'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { t } = useTranslation()
  const { user, profile, signOut } = useAuthStore()
  const [loading, setLoading] = useState(false)

  if (!isOpen || !user || !profile) return null

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      onClose()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'contributor':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên'
      case 'contributor':
        return 'Đóng góp viên'
      default:
        return 'Thành viên'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Hồ sơ người dùng</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url} alt={profile.username} />
              <AvatarFallback>
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{profile.full_name || profile.username}</h3>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              <Badge variant={getRoleBadgeVariant(profile.role)}>
                {getRoleDisplay(profile.role)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">{profile.reputation}</div>
              <div className="text-sm text-muted-foreground">Điểm uy tín</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Code className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{profile.contributions_count}</div>
              <div className="text-sm text-muted-foreground">Đóng góp</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Tham gia từ {new Date(profile.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full" disabled>
              <Edit3 className="mr-2 h-4 w-4" />
              Chỉnh sửa hồ sơ
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleSignOut}
              disabled={loading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
          
          <div className="text-center">
            <CardDescription className="text-xs">
              Email: {user.email}
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
