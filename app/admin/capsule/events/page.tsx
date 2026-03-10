import { AdminListPage } from '@/app/components/admin/AdminList'
import { getEvents } from '@/app/lib/actions/getEvents'

export const metadata = { title: 'Events - Admin' }

export default async function CapsuleEventsPage() {
  const data = await getEvents()
  return <AdminListPage data={data} pageTitle="Events" itemType="event" />
}
