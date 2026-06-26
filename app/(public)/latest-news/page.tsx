import LatestNewsClient from '@/app/components/pages/LatestNewsClient'
import { getNews } from '@/app/lib/actions/news/getNews'
import { getNewsletters } from '@/app/lib/actions/newsletter/getNewsletters'
import { getPageBySlugClient } from '@/app/lib/actions/page/getPageBySlugClient'

export default async function LatestNewsPage() {
  const [newsletters, news, pageData] = await Promise.all([
    getNewsletters(),
    getNews(),
    getPageBySlugClient('latest-news')
  ])
  return <LatestNewsClient newsletters={newsletters} news={news} pageData={pageData} />
}
