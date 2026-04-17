import AdminDashboardClient from '@/app/components/pages/AdminDashboardClient'
import { getDashboardStats } from '@/app/lib/actions/getDashboardStats'

export default async function AdminDashboardPage() {
  const result = await getDashboardStats()
  return <AdminDashboardClient stats={result} />
}
