import AdminDashboardClient from '@/app/components/pages/AdminDashboardClient'
import { getDashboardStats } from '@/app/lib/actions/_dashboard/getDashboardStats'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const result = await getDashboardStats()
  return <AdminDashboardClient stats={result} />
}
