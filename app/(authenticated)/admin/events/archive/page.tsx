import EventsArchiveClient from '@/app/(authenticated)/admin/events/archive/EventsArchiveClient'
import { getArchivedEvents } from '@/lib/actions/event/getArchivedEvents'

export default async function EventsArchivePage() {
  const data = await getArchivedEvents()
  return <EventsArchiveClient data={data} />
}
