'use client'

import { CodeSnippetManager } from '@/components/ui/code-snippet-manager'

export default function SnippetsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Code Snippets
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage, organize, and share your code snippets with the community
        </p>
      </div>
      
      <CodeSnippetManager />
    </div>
  )
}
