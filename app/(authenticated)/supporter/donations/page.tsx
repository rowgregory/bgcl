import SupporterDonationsClient from '@/app/(authenticated)/supporter/donations/SupporterDonationsClient'
import { getMyDonations } from '@/lib/actions/order/getMyDonations'

export const dynamic = 'force-dynamic'

export default async function SupporterDonationsLaPage() {
  const result = await getMyDonations()
  return <SupporterDonationsClient donations={result} />
}
