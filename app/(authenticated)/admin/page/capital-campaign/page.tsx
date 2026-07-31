import { PageEditorCapitalCampaignClient } from '@/app/(authenticated)/admin/page/capital-campaign/PageEditorCapitalCampaignClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorCapitalCampaignPage() {
  const data = await getPageBySlug('capital')
  return <PageEditorCapitalCampaignClient data={data} />
}
