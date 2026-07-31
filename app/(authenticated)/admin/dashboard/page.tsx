import AdminDashboardClient from '@/components/pages/AdminDashboardClient'
import { getDashboardStats } from '@/lib/actions/_dashboard/getDashboardStats'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const result = await getDashboardStats()
  return <AdminDashboardClient stats={result} />
}
