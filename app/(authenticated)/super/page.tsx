import SuperDashboardClient from './SuperDashboardClient'
import { getSuperDashboardData } from '@/app/lib/actions/_dashboard/getSuperDashboardData'

export const dynamic = 'force-dynamic'

export default async function SuperDashboardPage() {
  const result = await getSuperDashboardData()

  return <SuperDashboardClient logs={result.data.logs} />
}
