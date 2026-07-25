import { EventsOverviewClient } from '@/app/components/pages/EventsOverviewClient'
import { getEventsOverview } from '@/app/lib/actions/_dashboard/getEventsOverview'

export default async function EventsOverviewPage() {
  const data = await getEventsOverview()
  return <EventsOverviewClient data={data} />
}
