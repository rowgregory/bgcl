import NewsClient from '@/app/components/pages/NewsClient'
import { getNewsById } from '@/app/lib/actions/getNewsById'

export default async function NewsDetailPage({ params }) {
  const { id } = await params
  const { news } = await getNewsById(id)
  return <NewsClient news={news} />
}
