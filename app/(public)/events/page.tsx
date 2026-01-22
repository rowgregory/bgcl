import EventsClient from '@/app/components/pages/EventsClient'
import { getEvents } from '@/app/lib/actions/getEvents'

export default async function EventsPage() {
  const events = await getEvents()
  return <EventsClient events={events} />
}
