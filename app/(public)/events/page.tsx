export const dynamic = 'force-dynamic'
export const revalidate = 0

import EventsClient from '@/app/components/pages/EventsClient'
import { getActiveEvents } from '@/app/lib/actions/getActiveEvents'

export default async function EventsPage() {
  const events = await getActiveEvents()
  return <EventsClient events={events} />
}
