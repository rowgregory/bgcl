import LatestNewsClient from '@/app/components/pages/LatestNewsClient'
import { getNews } from '@/app/lib/actions/getNews'
import { getNewsletters } from '@/app/lib/actions/getNewsletters'

export default async function LatestNewsPage() {
  const newsletters = await getNewsletters()
  const news = await getNews()
  return <LatestNewsClient newsletters={newsletters} news={news} />
}
