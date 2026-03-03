import FuelTankOverviewClient from '@/app/components/pages/FuelTankOverviewClient'
import { getDonationStats } from '@/app/lib/actions/getDonationStats'

export default async function FuelTankOverviewPage() {
  const stats = await getDonationStats()
  return <FuelTankOverviewClient stats={stats} />
}
