import StoryClient from '@/app/components/pages/StoryClient'
import { getNewsById } from '@/app/lib/actions/getNewsById'

export default async function NewsDetailPage({ params }) {
  const { id } = await params
  const { news } = await getNewsById(id)
  return <StoryClient story={news} />
}
