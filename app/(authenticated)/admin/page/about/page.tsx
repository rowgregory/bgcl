import { PageEditorAboutClient } from '@/app/(authenticated)/admin/page/about/PageEditorAboutClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorAboutPage() {
  const data = await getPageBySlug('about')
  return <PageEditorAboutClient data={data} />
}
