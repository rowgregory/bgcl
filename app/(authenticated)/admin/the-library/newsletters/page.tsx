import { AdminListPage } from '@/app/components/admin/AdminList'
import { getNewsletters } from '@/app/lib/actions/newsletter/getNewsletters'

export const metadata = { title: 'Newsletters - Admin' }

export default async function NewsletterPage() {
  const data = await getNewsletters()
  return <AdminListPage data={data} pageTitle="Newsletters" itemType="newsletter" />
}
