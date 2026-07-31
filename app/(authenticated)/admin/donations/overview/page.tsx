import DonationsOverviewClient from '@/app/(authenticated)/admin/donations/overview/DonationsOverviewClient'
import { getDonationStats } from '@/lib/actions/_dashboard/getDonationStats'

export const dynamic = 'force-dynamic'

export default async function DonationsOverviewPage() {
  const stats = await getDonationStats()
  return <DonationsOverviewClient stats={stats} />
}
