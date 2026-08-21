import SupporterTicketsClient from '@/app/(authenticated)/supporter/tickets/SupporterTicketsClient'
import { getTicketOrders } from '@/lib/actions/order/getTicketOrders'

export default async function SupporterTicketsPage() {
  const result = await getTicketOrders()
  return <SupporterTicketsClient data={result.data} />
}
