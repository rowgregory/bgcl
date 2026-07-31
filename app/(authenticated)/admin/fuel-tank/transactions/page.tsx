import FuelTankTransactionsClient from '@/components/pages/FuelTankTransactionsClient'
import { getDonations } from '@/lib/actions/order/getDonations'

export const dynamic = 'force-dynamic'

export default async function FuelTankTransactionsPage() {
  const data = await getDonations()
  return <FuelTankTransactionsClient data={data} />
}
