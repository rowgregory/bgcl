import { EventsTransactionsClient } from '@/app/components/pages/EventsTransactionsClient'
import { getEventsTransactions } from '@/app/lib/actions/_dashboard/getEventsTransactions'

export default async function EventsTransactionsPage() {
  const data = await getEventsTransactions()
  return <EventsTransactionsClient data={data} />
}
