import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getNewsletters } from '@/lib/actions/newsletter/getNewsletters'
import NewsletterDrawer from './_components/NewsletterDrawer'

export const metadata = { title: 'Newsletters - Admin' }

export default async function NewsletterPage() {
  const result = await getNewsletters()
  return (
    <>
      <NewsletterDrawer />
      <AdminListPage data={result.data} pageTitle="Newsletters" itemType="newsletter" />
    </>
  )
}
