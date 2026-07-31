import { StarMapCapitalCampaignClient } from '@/components/pages/StarMapCapitalCampaignClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapCapitalCampaignPage() {
  const data = await getPageBySlug('capital')
  return <StarMapCapitalCampaignClient data={data} />
}
