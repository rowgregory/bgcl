import { CapsuleOverviewClient } from '@/app/components/pages/CapsuleOverviewClient'
import { getCapsuleOverview } from '@/app/lib/actions/_dashboard/getCapsuleOverview'

export default async function CapsuleOverviewPage() {
  const data = await getCapsuleOverview()
  return <CapsuleOverviewClient data={data} />
}
