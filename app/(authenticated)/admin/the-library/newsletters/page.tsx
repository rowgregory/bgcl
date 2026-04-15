import { AdminListPage } from '@/app/components/admin/AdminList'
import { getNewsletters } from '@/app/lib/actions/getNewsletters'

export const metadata = { title: 'Newsletters - Admin' }

export default async function NewsletterPage() {
  const data = await getNewsletters()
  return <AdminListPage data={data} pageTitle="Newsletters" itemType="newsletter" />
}
