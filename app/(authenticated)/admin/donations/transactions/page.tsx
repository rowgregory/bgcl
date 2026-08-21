import DonationsTransactionsClient from '@/app/(authenticated)/admin/donations/transactions/DonationsTransactionsClient'
import { getDonations } from '@/lib/actions/order/getDonations'

export default async function DonationsTransactionsPage() {
  const result = await getDonations()
  return <DonationsTransactionsClient data={result.data} />
}
