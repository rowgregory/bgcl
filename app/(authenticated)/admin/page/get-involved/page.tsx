import { PageEditorGetInvolvedClient } from '@/app/(authenticated)/admin/page/get-involved/PageEditorGetInvolvedClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorGetInvolvedPage() {
  const data = await getPageBySlug('get-involved')
  return <PageEditorGetInvolvedClient data={data} />
}
