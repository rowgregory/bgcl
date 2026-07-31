import DonationsTransactionsClient from '@/app/(authenticated)/admin/donations/transactions/DonationsTransactionsClient'
import { getDonations } from '@/lib/actions/order/getDonations'

export const dynamic = 'force-dynamic'

export default async function DonationsTransactionsPage() {
  const data = await getDonations()
  return <DonationsTransactionsClient data={data} />
}
