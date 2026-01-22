import DonateClient from '@/app/components/pages/DonateClient'
import { getCampaigns } from '@/app/lib/actions/getCampaigns'
import { getPrograms } from '@/app/lib/actions/getPrograms'

export default async function DonatePage() {
  const campaigns = await getCampaigns()
  return <DonateClient campaigns={campaigns} />
}
