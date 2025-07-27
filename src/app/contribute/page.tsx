'use client'

import { ContributeFunction } from '@/components/community/ContributeFunction'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Code2, 
  Users, 
  Star, 
  GitBranch,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react'

export default function ContributePage() {
  const stats = [
    {
      icon: Users,
      label: 'Contributors',
      value: '248',
      description: 'Active contributors'
    },
    {
      icon: Code2,
      label: 'Functions',
      value: '1,284',
      description: 'Total functions'
    },
    {
      icon: Star,
      label: 'Average Rating',
      value: '4.8',
      description: 'Community rating'
    },
    {
      icon: GitBranch,
      label: 'Languages',
      value: '3',
      description: 'Supported languages'
    }
  ]

  const guidelines = [
    {
      icon: CheckCircle,
      title: 'Chất lượng code',
      description: 'Code phải clean, có comment và follow best practices'
    },
    {
      icon: CheckCircle,
      title: 'Documentation đầy đủ',
      description: 'Bao gồm mô tả, parameters, return values và examples'
    },
    {
      icon: CheckCircle,
      title: 'Test cases',
      description: 'Nên có test cases hoặc ví dụ sử dụng thực tế'
    },
    {
      icon: CheckCircle,
      title: 'Unique & Useful',
      description: 'Function phải hữu ích và chưa có trong library'
    }
  ]

  const process = [
    {
      step: 1,
      icon: Code2,
      title: 'Viết Function',
      description: 'Tạo function với code chất lượng cao và documentation đầy đủ'
    },
    {
      step: 2,
      icon: Clock,
      title: 'Review Process',
      description: 'Team sẽ review code, test functionality và quality'
    },
    {
      step: 3,
      icon: CheckCircle,
      title: 'Published',
      description: 'Function được publish và có thể sử dụng bởi cộng đồng'
    },
    {
      step: 4,
      icon: Award,
      title: 'Rewards',
      description: 'Nhận điểm reputation và recognition từ cộng đồng'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Đóng góp cho CodeUtilsHub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Chia sẻ những utility functions hữu ích của bạn với cộng đồng developer. 
          Mỗi đóng góp đều được đánh giá cao và mang lại giá trị.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <stat.icon className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm font-medium text-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn đóng góp</CardTitle>
          <CardDescription>
            Để đảm bảo chất lượng và tính hữu ích của library, vui lòng tuân thủ các guidelines sau:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {guidelines.map((guideline, index) => (
              <div key={index} className="flex items-start space-x-3">
                <guideline.icon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">{guideline.title}</h4>
                  <p className="text-sm text-muted-foreground">{guideline.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Process */}
      <Card>
        <CardHeader>
          <CardTitle>Quy trình đóng góp</CardTitle>
          <CardDescription>
            Function của bạn sẽ trải qua các bước sau để được publish
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="relative">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge 
                    variant="default" 
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center text-xs"
                  >
                    {step.step}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contribute Form */}
      <ContributeFunction 
        onSuccess={(functionId) => {
          console.log('Function submitted successfully:', functionId)
        }}
      />

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            Tham gia cộng đồng CodeUtilsHub
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Kết nối với hàng nghìn developers khác, chia sẻ kiến thức và xây dựng 
            một library utility functions tốt nhất cho cộng đồng.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Open Source
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              Recognition
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Quality First
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
