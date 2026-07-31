import { PageEditorHomeClient } from '@/app/(authenticated)/admin/page/home/PageEditorHomeClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorHomePage() {
  const data = await getPageBySlug('home')
  return <PageEditorHomeClient data={data} />
}
