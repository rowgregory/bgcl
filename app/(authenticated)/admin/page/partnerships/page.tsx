import { PageEditorPartnershipsClient } from '@/app/(authenticated)/admin/page/partnerships/PageEditorPartnershipsClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorPartnershipsPage() {
  const data = await getPageBySlug('partner')
  return <PageEditorPartnershipsClient data={data} />
}
