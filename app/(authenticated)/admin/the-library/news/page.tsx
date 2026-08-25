import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getNews } from '@/lib/actions/news/getNews'
import { NewsDrawer } from './_components/NewsDrawer'

export const metadata = { title: 'News - Admin' }

export default async function NewsPage() {
  const result = await getNews()
  return (
    <>
      <NewsDrawer />
      <AdminListPage data={result.data} pageTitle="News" itemType="news" />
    </>
  )
}
