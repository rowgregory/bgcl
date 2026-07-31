import { AdminListPage } from '@/components/admin/layout/AdminList'
import { getClosings } from '@/lib/actions/closing/getClosings'

export default async function ClosingsPage() {
  const closings = await getClosings()
  return <AdminListPage data={closings} pageTitle="Closings" itemType="closing" />
}
