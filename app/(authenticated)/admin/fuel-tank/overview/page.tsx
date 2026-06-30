import FuelTankOverviewClient from '@/app/components/pages/FuelTankOverviewClient'
import { getDonationStats } from '@/app/lib/actions/_dashboard/getDonationStats'

export const dynamic = 'force-dynamic'

export default async function FuelTankOverviewPage() {
  const stats = await getDonationStats()
  return <FuelTankOverviewClient stats={stats} />
}
