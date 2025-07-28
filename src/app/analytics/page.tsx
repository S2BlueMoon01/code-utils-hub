import { AnalyticsDashboard } from '@/components/analytics-dashboard'

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <AnalyticsDashboard />
    </div>
  )
}

export const metadata = {
  title: 'Analytics Dashboard - CodeUtilsHub',
  description: 'Real-time performance metrics and user engagement analytics',
}
