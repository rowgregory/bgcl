import { StarMapLatestNewsClient } from '@/components/pages/StarMapLatestNewsClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapLatestNewsPage() {
  const data = await getPageBySlug('latest-news')
  return <StarMapLatestNewsClient data={data} />
}
