'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { dbHelpers } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AnimatedPage, FadeIn, SlideUp } from '@/components/ui/motion'
import { CodeEditorSkeleton } from '@/components/ui/skeleton'
import { PlaygroundErrorBoundary } from '@/components/ui/error-boundary'
import { 
  Code2, 
  Send, 
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface ContributeFunctionProps {
  onSuccess?: (functionId: string) => void
}

export function ContributeFunction({ onSuccess }: ContributeFunctionProps) {
  const { t } = useTranslation()
  const { user, profile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript' as 'javascript' | 'typescript' | 'python',
    category: '',
    tags: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  })

  const categories = [
    'Array Manipulation',
    'String Processing', 
    'Data Validation',
    'Date & Time',
    'Mathematical Operations',
    'Object Operations',
    'Performance Optimization',
    'DOM Manipulation',
    'API Helpers',
    'Utility Functions'
  ]

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' }
  ]

  const difficulties = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('Bạn cần đăng nhập để đóng góp function')
      return
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.code.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const functionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        code: formData.code.trim(),
        language: formData.language,
        category: formData.category,
        tags: tagsArray,
        difficulty: formData.difficulty,
        author_id: user.id
      }

      const newFunction = await dbHelpers.createFunction(functionData)
      
      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        code: '',
        language: 'javascript',
        category: '',
        tags: '',
        difficulty: 'beginner'
      })

      if (onSuccess) {
        onSuccess(newFunction.id)
      }

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)

    } catch (err) {
      console.error('Error creating function:', err)
      setError('Có lỗi xảy ra khi tạo function. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const getCodeTemplate = (language: string) => {
    switch (language) {
      case 'python':
        return `def my_function(param):
    """
    Function description here
    
    Args:
        param: Parameter description
        
    Returns:
        Return value description
    """
    # Your code here
    return result

# Example usage
print(my_function("example"))`

      case 'typescript':
        return `/**
 * Function description here
 * @param param - Parameter description
 * @returns Return value description
 */
function myFunction(param: string): string {
  // Your code here
  return result;
}

// Example usage
console.log(myFunction("example"));`

      default:
        return `/**
 * Function description here
 * @param {string} param - Parameter description
 * @returns {string} Return value description
 */
function myFunction(param) {
  // Your code here
  return result;
}

// Example usage
console.log(myFunction("example"));`
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code2 className="w-5 h-5" />
            <span>Đóng góp Function</span>
          </CardTitle>
          <CardDescription>
            Chia sẻ function hữu ích của bạn với cộng đồng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Bạn cần đăng nhập để đóng góp function cho cộng đồng.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code2 className="w-5 h-5" />
          <span>Đóng góp Function Mới</span>
        </CardTitle>
        <CardDescription>
          Chia sẻ function hữu ích của bạn với cộng đồng. Function sẽ được xem xét trước khi publish.
        </CardDescription>
        {profile && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Đóng góp bởi:</span>
            <Badge variant="outline">{profile.username}</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-6">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              Function đã được gửi thành công! Chúng tôi sẽ xem xét và publish sớm nhất có thể.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tên Function *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="VD: formatCurrency, validateEmail, debounce..."
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Mô tả ngắn gọn về tác dụng và cách sử dụng function..."
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Language & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Ngôn ngữ *</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value: string) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    language: value as typeof formData.language,
                    code: getCodeTemplate(value)
                  }))
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: string) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="javascript, utility, helper (phân cách bằng dấu phẩy)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value: string) => setFormData(prev => ({ ...prev, difficulty: value as typeof formData.difficulty }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff.value} value={diff.value}>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${diff.color}`}>
                          {diff.label}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Textarea
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder={getCodeTemplate(formData.language)}
              className="min-h-[300px] font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Bao gồm documentation, example usage và test cases nếu có thể
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Gửi Function
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
