import { PageEditorCampaignsClient } from '@/app/(authenticated)/admin/page/campaigns/PageEditorCampaignsClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorCampaignsPage() {
  const data = await getPageBySlug('campaign')
  return <PageEditorCampaignsClient data={data} />
}
