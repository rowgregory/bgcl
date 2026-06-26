import FuelTankOverviewClient from '@/app/components/pages/FuelTankOverviewClient'
import { getDonationStats } from '@/app/lib/actions/_dashboard/getDonationStats'

export default async function FuelTankOverviewPage() {
  const stats = await getDonationStats()
  return <FuelTankOverviewClient stats={stats} />
}
