import SupporterOverviewClient from '@/app/components/pages/SupporterOverviewClient'
import { getSupporterDashboard } from '@/app/lib/actions/getSupporterDashboard'

export const dynamic = 'force-dynamic'

export default async function SupporterOverviewPage() {
  const data = await getSupporterDashboard()
  return <SupporterOverviewClient data={data} />
}
