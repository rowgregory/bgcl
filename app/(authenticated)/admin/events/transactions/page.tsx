import EventsTransactionsClient from '@/app/(authenticated)/admin/events/transactions/EventsTransactionsClient'
import { getEventsTransactions } from '@/lib/actions/_dashboard/getEventsTransactions'

export default async function EventsTransactionsPage() {
  const result = await getEventsTransactions()
  return <EventsTransactionsClient data={result.data} />
}
