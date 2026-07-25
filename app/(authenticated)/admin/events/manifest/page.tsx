import EventsManifestClient from '@/app/components/pages/EventsManifestClient'
import { getEventsTransactions } from '@/app/lib/actions/_dashboard/getEventsTransactions'

export default async function EventsManifestPage() {
  const data = await getEventsTransactions()
  return <EventsManifestClient data={data} />
}
