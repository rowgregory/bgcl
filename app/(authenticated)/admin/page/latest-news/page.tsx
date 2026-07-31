import { PageEditorLatestNewsClient } from '@/app/(authenticated)/admin/page/latest-news/PageEditorLatestNewsClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorLatestNewsPage() {
  const data = await getPageBySlug('latest-news')
  return <PageEditorLatestNewsClient data={data} />
}
