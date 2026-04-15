import { StarMapCampaignsClient } from '@/app/components/pages/StarMapCampaignsClient'
import { getPageBySlug } from '@/app/lib/actions/getPageBySlug'

export default async function StarMapCampaignsPage() {
  const data = await getPageBySlug('campaign')
  return <StarMapCampaignsClient data={data} />
}
