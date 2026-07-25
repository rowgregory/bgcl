import EventsArchiveClient from '@/app/components/pages/EventsArchiveClient'
import { getArchivedEvents } from '@/app/lib/actions/event/getArchivedEvents'

export default async function EventsArchivePage() {
  const data = await getArchivedEvents()
  return <EventsArchiveClient data={data} />
}
