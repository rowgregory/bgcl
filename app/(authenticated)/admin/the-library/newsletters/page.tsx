import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getNewsletters } from '@/lib/actions/newsletter/getNewsletters'

export const metadata = { title: 'Newsletters - Admin' }

export default async function NewsletterPage() {
  const result = await getNewsletters()
  return <AdminListPage data={result.data} pageTitle="Newsletters" itemType="newsletter" />
}
