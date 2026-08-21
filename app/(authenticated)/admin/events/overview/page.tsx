import { EventsOverviewClient } from '@/app/(authenticated)/admin/events/overview/EventsOverviewClient'
import { getEventsOverview } from '@/lib/actions/_dashboard/getEventsOverview'

export default async function EventsOverviewPage() {
  const result = await getEventsOverview()
  return <EventsOverviewClient data={result.data} />
}
