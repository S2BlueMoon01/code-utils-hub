'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  MessageCircle,
  Mail,
  Book
} from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const categories = [
    'all',
    'Getting Started',
    'Functions',
    'Community',
    'Account',
    'Technical',
    'Billing'
  ]

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'CodeUtilsHub là gì và nó hoạt động như thế nào?',
      answer: 'CodeUtilsHub là một nền tảng cộng đồng dành cho developers, cung cấp và chia sẻ các utility functions hữu ích. Bạn có thể tìm kiếm, sử dụng và đóng góp các functions để tăng tốc quá trình phát triển phần mềm. Nền tảng hỗ trợ nhiều ngôn ngữ lập trình như JavaScript, TypeScript và Python.',
      category: 'Getting Started',
      tags: ['platform', 'overview', 'basics']
    },
    {
      id: '2',
      question: 'Làm thế nào để đóng góp một function mới?',
      answer: 'Để đóng góp function mới, bạn cần: 1) Đăng ký tài khoản, 2) Truy cập trang "Contribute", 3) Điền thông tin function bao gồm tên, mô tả, code, và ví dụ, 4) Chọn category và tags phù hợp, 5) Submit để review. Function sẽ được community review trước khi được phê duyệt.',
      category: 'Functions',
      tags: ['contribute', 'submit', 'functions']
    },
    {
      id: '3',
      question: 'Tôi có thể sử dụng các functions này trong dự án thương mại không?',
      answer: 'Có, tất cả functions trên CodeUtilsHub đều có thể sử dụng miễn phí trong các dự án thương mại. Chúng tôi khuyến khích ghi credit cho tác giả gốc khi có thể. Tuy nhiên, hãy kiểm tra license cụ thể của từng function để đảm bảo tuân thủ đúng quy định.',
      category: 'Technical',
      tags: ['commercial', 'license', 'usage']
    },
    {
      id: '4',
      question: 'Làm thế nào để tìm kiếm functions phù hợp?',
      answer: 'Bạn có thể sử dụng tính năng tìm kiếm nâng cao với các bộ lọc: 1) Tìm kiếm theo từ khóa, 2) Lọc theo category (array, string, date, etc.), 3) Lọc theo ngôn ngữ lập trình, 4) Sắp xếp theo popularity, rating hoặc ngày tạo. Ngoài ra, bạn có thể browse theo tags phổ biến.',
      category: 'Functions',
      tags: ['search', 'filters', 'discovery']
    },
    {
      id: '5',
      question: 'Playground có những tính năng gì?',
      answer: 'Playground cho phép bạn: 1) Test các functions trực tiếp trong browser, 2) Chỉnh sửa code và xem kết quả real-time, 3) Thử nghiệm với different inputs, 4) Save và share code snippets, 5) Hỗ trợ multiple tabs cho nhiều functions cùng lúc. Đây là môi trường an toàn để thử nghiệm trước khi sử dụng trong dự án.',
      category: 'Technical',
      tags: ['playground', 'testing', 'features']
    },
    {
      id: '6',
      question: 'Làm thế nào để tạo tài khoản và đăng nhập?',
      answer: 'Bạn có thể tạo tài khoản bằng cách: 1) Click nút "Đăng nhập" ở header, 2) Chọn tab "Đăng ký", 3) Nhập email và password, 4) Xác nhận email nếu được yêu cầu. Bạn cũng có thể đăng nhập bằng GitHub hoặc Google để thuận tiện hơn.',
      category: 'Account',
      tags: ['account', 'registration', 'login']
    },
    {
      id: '7',
      question: 'Tôi có thể edit hoặc xóa functions đã submit không?',
      answer: 'Có, bạn có thể manage các functions của mình thông qua Dashboard: 1) Truy cập Dashboard từ menu user, 2) Vào tab "Functions", 3) Click vào function muốn chỉnh sửa, 4) Sử dụng options Edit hoặc Delete. Lưu ý rằng việc xóa function có thể ảnh hưởng đến users khác đang sử dụng.',
      category: 'Functions',
      tags: ['edit', 'delete', 'manage']
    },
    {
      id: '8',
      question: 'Community guidelines là gì?',
      answer: 'Community guidelines bao gồm: 1) Code phải clean, có comment rõ ràng, 2) Không submit malicious code, 3) Respect tác giả và credit nguồn gốc, 4) Functions phải có test cases đầy đủ, 5) Mô tả phải accurate và helpful, 6) Tương tác lịch sự trong comments. Vi phạm có thể dẫn đến account bị suspend.',
      category: 'Community',
      tags: ['guidelines', 'rules', 'community']
    },
    {
      id: '9',
      question: 'Hệ thống rating và comments hoạt động ra sao?',
      answer: 'Users có thể: 1) Rate functions từ 1-5 sao, 2) Viết comments và feedback, 3) Reply cho comments khác, 4) Report inappropriate content. Rating giúp cộng đồng identify các functions chất lượng cao. Authors nhận notifications khi có rating/comments mới.',
      category: 'Community',
      tags: ['rating', 'comments', 'feedback']
    },
    {
      id: '10',
      question: 'Có mobile app không?',
      answer: 'Hiện tại chúng tôi chưa có mobile app riêng, nhưng website được optimize cho mobile browser. Bạn có thể truy cập đầy đủ tính năng thông qua mobile browser. Mobile app native đang trong roadmap phát triển và sẽ được ra mắt trong tương lai.',
      category: 'Technical',
      tags: ['mobile', 'app', 'responsive']
    },
    {
      id: '11',
      question: 'Làm thế nào để báo cáo bugs hoặc suggest features?',
      answer: 'Bạn có thể: 1) Tạo issue trên GitHub repository, 2) Gửi email đến support team, 3) Sử dụng feedback form trong website, 4) Join Discord community để discussion. Chúng tôi welcome mọi feedback và suggestions để cải thiện platform.',
      category: 'Technical',
      tags: ['bugs', 'features', 'feedback', 'support']
    },
    {
      id: '12',
      question: 'CodeUtilsHub có miễn phí không?',
      answer: 'Có, CodeUtilsHub hoàn toàn miễn phí cho personal use. Tất cả core features như tìm kiếm, sử dụng functions, playground đều free. Trong tương lai có thể có premium features cho enterprise users, nhưng community version sẽ luôn miễn phí.',
      category: 'Billing',
      tags: ['free', 'pricing', 'cost']
    }
  ]

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQs.map(item => item.id)))
  }

  const collapseAll = () => {
    setExpandedItems(new Set())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Tìm câu trả lời cho các câu hỏi thường gặp về CodeUtilsHub
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'Tất cả' : category}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Mở rộng tất cả
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Thu gọn tất cả
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FAQ List */}
        <div className="lg:col-span-3">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy câu hỏi</h3>
                <p className="text-muted-foreground">
                  Thử thay đổi từ khóa tìm kiếm hoặc category
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((item) => (
                <Card key={item.id} className="transition-shadow hover:shadow-md">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{item.category}</Badge>
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="text-left text-lg">
                          {item.question}
                        </CardTitle>
                      </div>
                      {expandedItems.has(item.id) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedItems.has(item.id) && (
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>FAQ Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Tổng câu hỏi</span>
                  <Badge variant="outline">{faqItems.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Categories</span>
                  <Badge variant="outline">{categories.length - 1}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Hiển thị</span>
                  <Badge variant="outline">{filteredFAQs.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.filter(cat => cat !== 'all').map((category) => {
                  const count = faqItems.filter(item => item.category === category).length
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Need More Help */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Cần hỗ trợ thêm?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Không tìm thấy câu trả lời? Chúng tôi sẵn sàng giúp đỡ!
              </p>
              <div className="space-y-2">
                <Link href="/contact">
                  <Button className="w-full" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Liên hệ Support
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button className="w-full" variant="outline">
                    <Book className="w-4 h-4 mr-2" />
                    Xem Documentation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
