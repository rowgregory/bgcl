import { AdminListPage } from '@/components/admin/layout/AdminList'
import { getNews } from '@/lib/actions/news/getNews'

export const metadata = { title: 'News - Admin' }

export default async function NewsPage() {
  const data = await getNews()

  return <AdminListPage data={data} pageTitle="News" itemType="news" />
}
