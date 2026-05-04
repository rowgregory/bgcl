import { auth } from '@/app/lib/auth'
import SuperDashboardClient from './SuperDashboardClient'
import { redirect } from 'next/navigation'
import { getSuperDashboardData } from '@/app/lib/actions/super/getSuperDashboardData'

export const dynamic = 'force-dynamic'

export default async function SuperDashboardPage() {
  const session = await auth()
  if (session?.user?.role !== 'SUPERUSER') redirect('/admin/dashboard')

  const result = await getSuperDashboardData()

  return <SuperDashboardClient logs={result.data.logs} />
}
