import { getDonationOrders } from '@/app/lib/actions/getDonationOrders'
import TheFuelTank from './page'

export default async function FuelTankLayout() {
  const orders = await getDonationOrders()
  return <TheFuelTank orders={orders} />
}
