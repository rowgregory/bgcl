import SupporterDonationsClient from '@/app/components/pages/SupporterDonationsClient'
import { getMyDonations } from '@/app/lib/actions/getMyDonations'

export const dynamic = 'force-dynamic'

export default async function SupporterDonationsLaPage() {
  const donations = await getMyDonations()
  return <SupporterDonationsClient donations={donations} />
}
