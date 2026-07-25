import NewsClient from '@/app/(public)/award-winners/[id]/NewsClient'
import { getNewsById } from '@/app/lib/actions/news/getNewsById'

export default async function NewsDetailPage({ params }) {
  const { id } = await params
  const { news } = await getNewsById(id)
  return <NewsClient news={news} />
}
