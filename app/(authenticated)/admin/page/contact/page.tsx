import { PageEditorContactClient } from '@/app/(authenticated)/admin/page/contact/PageEditorContactClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorContactPage() {
  const data = await getPageBySlug('contact')
  return <PageEditorContactClient data={data} />
}
