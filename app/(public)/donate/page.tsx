import DonateClient from '@/app/components/pages/DonateClient'
import { getCampaigns } from '@/app/lib/actions/getCampaigns'

export default async function DonatePage() {
  const campaigns = await getCampaigns()
  return <DonateClient campaigns={campaigns} />
}
