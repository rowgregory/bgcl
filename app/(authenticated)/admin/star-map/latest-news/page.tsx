import { StarMapLatestNewsClient } from '@/app/components/pages/StarMapLatestNewsClient'
import { getPageBySlug } from '@/app/lib/actions/getPageBySlug'

export default async function StarMapLatestNewsPage() {
  const data = await getPageBySlug('latest-news')
  return <StarMapLatestNewsClient data={data} />
}
