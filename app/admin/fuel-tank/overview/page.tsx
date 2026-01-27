import FuelTankOverviewClient from '@/app/components/pages/FuelTankOverviewClient'
import { getDonationOrders } from '@/app/lib/actions/getDonationOrders'
import { getDonationStats } from '@/app/lib/actions/getDonationStats'

export default async function FuelTankOverviewPage() {
  const data = await getDonationOrders()
  const stats = await getDonationStats()
  return <FuelTankOverviewClient orders={data} stats={stats} />
}
