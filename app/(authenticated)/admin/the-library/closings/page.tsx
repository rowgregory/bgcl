import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getClosings } from '@/lib/actions/closing/getClosings'
import ClosingDrawer from './_components/ClosingDrawer'

export default async function ClosingsPage() {
  const result = await getClosings()
  return (
    <>
      <ClosingDrawer />
      <AdminListPage data={result.data} pageTitle="Closings" itemType="closing" />
    </>
  )
}
