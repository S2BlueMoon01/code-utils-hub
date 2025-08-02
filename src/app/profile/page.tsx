import { Metadata } from 'next'
import { UserProfile } from '@/components/ui/user-profile'

export const metadata: Metadata = {
  title: 'User Profile | CodeUtils Hub',
  description: 'View and manage your CodeUtils Hub profile, contributions, and settings.',
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile isOwnProfile={true} />
    </div>
  )
}
