import LatestNewsClient from '@/app/components/pages/LatestNewsClient'
import { getNews } from '@/app/lib/actions/getNews'
import { getNewsletters } from '@/app/lib/actions/getNewsletters'
import { getPageBySlugClient } from '@/app/lib/actions/getPageBySlugClient'

export default async function LatestNewsPage() {
  const [newsletters, news, pageData] = await Promise.all([
    getNewsletters(),
    getNews(),
    getPageBySlugClient('latest-news')
  ])
  return <LatestNewsClient newsletters={newsletters} news={news} pageData={pageData} />
}
