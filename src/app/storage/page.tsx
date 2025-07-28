import { StorageManager } from '@/components/StorageManager'

export default function StoragePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Storage Manager</h1>
          <p className="text-muted-foreground">
            Manage your playground code storage and clean up old entries
          </p>
        </div>

        {/* Storage Manager Component */}
        <StorageManager />
      </div>
    </div>
  )
}
