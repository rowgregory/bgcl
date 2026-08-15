import NewsClient from '@/app/(public)/award-winners/[id]/NewsClient'
import { getNewsById } from '@/lib/actions/news/getNewsById'

export default async function NewsDetailPage({ params }) {
  const { id } = await params
  const result = await getNewsById(id)
  return <NewsClient news={result.data} />
}
