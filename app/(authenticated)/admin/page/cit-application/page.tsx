import { PageEditorCITApplicationClient } from '@/app/(authenticated)/admin/page/cit-application/PageEditorCITApplicationClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorCapitalCampaignPage() {
  const data = await getPageBySlug('cit')
  return <PageEditorCITApplicationClient data={data} />
}
