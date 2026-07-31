import { EventsTransactionsClient } from '@/components/pages/EventsTransactionsClient'
import { getEventsTransactions } from '@/lib/actions/_dashboard/getEventsTransactions'

export default async function EventsTransactionsPage() {
  const data = await getEventsTransactions()
  return <EventsTransactionsClient data={data} />
}
