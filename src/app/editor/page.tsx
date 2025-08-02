import { Metadata } from 'next'
import { AdvancedCodeEditor } from '@/components/ui/advanced-code-editor'

export const metadata: Metadata = {
  title: 'Advanced Editor | CodeUtils Hub',
  description: 'Professional code editor with multi-file support, syntax highlighting, and code execution.',
}

export default function AdvancedEditorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Advanced Code Editor</h1>
          <p className="text-muted-foreground mt-2">
            Professional code editor with multi-file support, syntax highlighting, and live code execution
          </p>
        </div>
        
        <AdvancedCodeEditor />
      </div>
    </div>
  )
}
