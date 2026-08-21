import DonationsOverviewClient from '@/app/(authenticated)/admin/donations/overview/DonationsOverviewClient'
import { getDonationStats } from '@/lib/actions/_dashboard/getDonationStats'

export default async function DonationsOverviewPage() {
  const result = await getDonationStats()
  return <DonationsOverviewClient stats={result.data} />
}
