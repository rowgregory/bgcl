import SupporterDonationsClient from '@/components/pages/SupporterDonationsClient'
import { getMyDonations } from '@/lib/actions/order/getMyDonations'

export const dynamic = 'force-dynamic'

export default async function SupporterDonationsLaPage() {
  const donations = await getMyDonations()
  return <SupporterDonationsClient donations={donations} />
}
