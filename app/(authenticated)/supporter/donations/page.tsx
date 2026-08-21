import SupporterDonationsClient from '@/app/(authenticated)/supporter/donations/SupporterDonationsClient'
import { getMyDonations } from '@/lib/actions/order/getMyDonations'

export default async function SupporterDonationsLaPage() {
  const result = await getMyDonations()
  return <SupporterDonationsClient donations={result.data} />
}
