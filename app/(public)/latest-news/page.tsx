import LatestNewsClient from '@/app/(public)/latest-news/LatestNewsClient'
import { getNews } from '@/lib/actions/news/getNews'
import { getNewsletters } from '@/lib/actions/newsletter/getNewsletters'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'

export default async function LatestNewsPage() {
  const [newsletters, news, pageData] = await Promise.all([
    getNewsletters(),
    getNews(),
    getPageBySlugClient('latest-news')
  ])
  return <LatestNewsClient newsletters={newsletters.data} news={news.data} pageData={pageData} />
}
