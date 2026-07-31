import EventsManifestClient from '@/components/pages/EventsManifestClient'
import { getEventsTransactions } from '@/lib/actions/_dashboard/getEventsTransactions'

export default async function EventsManifestPage() {
  const data = await getEventsTransactions()
  return <EventsManifestClient data={data} />
}
