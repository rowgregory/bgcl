import FuelTankTransactionsClient from '@/app/components/pages/FuelTankTransactionsClient'
import { getDonations } from '@/app/lib/actions/getDonations'

export default async function FuelTankTransactionsPage() {
  const data = await getDonations()
  return <FuelTankTransactionsClient data={data} />
}
