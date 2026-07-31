import { StarMapCITApplicationClient } from '@/app/(authenticated)/admin/star-map/cit-application/StarMapCITApplicationClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapCapitalCampaignPage() {
  const data = await getPageBySlug('cit')
  return <StarMapCITApplicationClient data={data} />
}
