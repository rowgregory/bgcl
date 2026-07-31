import { StarMapCampaignsClient } from '@/components/pages/StarMapCampaignsClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapCampaignsPage() {
  const data = await getPageBySlug('campaign')
  return <StarMapCampaignsClient data={data} />
}
