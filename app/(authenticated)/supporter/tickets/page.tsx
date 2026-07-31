import SupporterTicketsClient from '@/components/pages/SupporterTicketsClient'
import { getTicketOrders } from '@/lib/actions/order/getTicketOrders'

export const dynamic = 'force-dynamic'

export default async function SupporterTicketsPage() {
  const result = await getTicketOrders()
  return <SupporterTicketsClient data={result.data} />
}
