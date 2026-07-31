import { EventsOverviewClient } from '@/components/pages/EventsOverviewClient'
import { getEventsOverview } from '@/lib/actions/_dashboard/getEventsOverview'

export default async function EventsOverviewPage() {
  const data = await getEventsOverview()
  return <EventsOverviewClient data={data} />
}
