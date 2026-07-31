import { AdminListPage } from '@/components/admin/layout/AdminList'
import { getEvents } from '@/lib/actions/event/getEvents'

export const metadata = { title: 'Events - Admin' }

export default async function EventsEventsPage() {
  const result = await getEvents()
  return <AdminListPage data={result?.data} pageTitle="Events" itemType="event" />
}
