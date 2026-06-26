import { StarMapCapitalCampaignClient } from '@/app/components/pages/StarMapCapitalCampaignClient'
import { getPageBySlug } from '@/app/lib/actions/page/getPageBySlug'

export default async function StarMapCapitalCampaignPage() {
  const data = await getPageBySlug('capital')
  return <StarMapCapitalCampaignClient data={data} />
}
