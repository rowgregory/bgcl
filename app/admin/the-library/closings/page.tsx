import { AdminListPage } from '@/app/components/admin/AdminList'
import { getClosings } from '@/app/lib/actions/getClosings'

export default async function ClosingsPage() {
  const closings = await getClosings()
  return <AdminListPage data={closings} pageTitle="Closings" itemType="closing" />
}
