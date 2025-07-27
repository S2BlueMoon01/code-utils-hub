'use client'

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
  const teamMembers = [
    {
      name: 'Nguyễn Văn A',
      role: 'Founder & Lead Developer',
      avatar: '/avatars/member1.jpg',
      bio: 'Passionate về việc tạo ra các công cụ giúp developers làm việc hiệu quả hơn.',
      social: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com'
      }
    },
    {
      name: 'Trần Thị B',
      role: 'UX/UI Designer',
      avatar: '/avatars/member2.jpg',
      bio: 'Chuyên về thiết kế user experience và interface để tạo ra sản phẩm dễ sử dụng.',
      social: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com'
      }
    },
    {
      name: 'Lê Văn C',
      role: 'Backend Developer',
      avatar: '/avatars/member3.jpg',
      bio: 'Chuyên về xây dựng hệ thống backend mạnh mẽ và bảo mật.',
      social: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com'
      }
    }
  ]

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Functions', value: '500+', icon: Code },
    { label: 'Community Rating', value: '4.9/5', icon: Star },
    { label: 'Countries', value: '50+', icon: Globe }
  ]

  const values = [
    {
      title: 'Chất lượng',
      description: 'Chúng tôi cam kết cung cấp những utility functions chất lượng cao, được test kỹ lưỡng.',
      icon: Star
    },
    {
      title: 'Cộng đồng',
      description: 'Xây dựng một cộng đồng developers mạnh mẽ, nơi mọi người cùng học hỏi và chia sẻ.',
      icon: Users
    },
    {
      title: 'Đổi mới',
      description: 'Liên tục cập nhật và cải tiến để mang đến những công cụ tiên tiến nhất.',
      icon: Zap
    },
    {
      title: 'Minh bạch',
      description: 'Tất cả source code đều open source, mọi người có thể đóng góp và học hỏi.',
      icon: Shield
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Về CodeUtilsHub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          CodeUtilsHub là nền tảng cộng đồng dành cho developers, cung cấp và chia sẻ 
          các utility functions hữu ích để tăng tốc quá trình phát triển phần mềm.
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
              Sứ mệnh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Chúng tôi tin rằng việc chia sẻ kiến thức và công cụ sẽ giúp cộng đồng developers 
              phát triển mạnh mẽ hơn. CodeUtilsHub được tạo ra để trở thành nơi tập trung 
              các utility functions chất lượng cao, giúp developers tiết kiệm thời gian 
              và tập trung vào việc giải quyết các vấn đề kinh doanh quan trọng.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Tầm nhìn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Trở thành nền tảng hàng đầu cho việc chia sẻ và khám phá các utility functions, 
              nơi mọi developer có thể tìm thấy những công cụ họ cần và đóng góp những 
              giải pháp của riêng mình cho cộng đồng. Chúng tôi hướng đến một thế giới 
              nơi việc lập trình trở nên hiệu quả và thú vị hơn.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Giá trị cốt lõi</h2>
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
        <h2 className="text-2xl font-bold text-center mb-8">Đội ngũ phát triển</h2>
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
          <CardTitle className="text-center">Technology Stack</CardTitle>
          <CardDescription className="text-center">
            Các công nghệ chúng tôi sử dụng để xây dựng CodeUtilsHub
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
          <h2 className="text-2xl font-bold mb-4">Tham gia cùng chúng tôi</h2>
          <p className="text-muted-foreground mb-6">
            Bạn có ý tưởng về feature mới hoặc muốn đóng góp cho dự án? 
            Chúng tôi luôn chào đón sự tham gia của cộng đồng!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contribute">
              <Button size="lg">
                <Code className="w-4 h-4 mr-2" />
                Đóng góp Function
              </Button>
            </Link>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com" target="_blank">
                <Github className="w-4 h-4 mr-2" />
                GitHub Repository
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:contact@codeutilshub.com">
                <Mail className="w-4 h-4 mr-2" />
                Liên hệ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
