import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getClosings } from '@/lib/actions/closing/getClosings'

export default async function ClosingsPage() {
  const result = await getClosings()
  return <AdminListPage data={result.data} pageTitle="Closings" itemType="closing" />
}
