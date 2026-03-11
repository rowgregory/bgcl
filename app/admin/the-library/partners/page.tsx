import { AdminListPage } from '@/app/components/admin/AdminList'
import { getPartners } from '@/app/lib/actions/getPartners'

export const metadata = { title: 'Partners - Admin' }

export default async function PartnersPage() {
  const data = await getPartners()
  return <AdminListPage data={data} pageTitle="Partners" itemType="partner" />
}
