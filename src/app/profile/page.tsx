'use client'

import dynamic from 'next/dynamic'

// Dynamically import the UserProfile component to avoid SSR issues
const UserProfile = dynamic(
  () => import('@/components/ui/user-profile').then(mod => ({ default: mod.UserProfile })),
  {
    ssr: false,
    loading: () => (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }
)

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile isOwnProfile={true} />
    </div>
  )
}
