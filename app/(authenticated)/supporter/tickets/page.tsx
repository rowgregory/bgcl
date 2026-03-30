import SupporterTicketsClient from '@/app/components/pages/SupporterTicketsClient'
import { getTicketOrders } from '@/app/lib/actions/getTicketOrders'

export const dynamic = 'force-dynamic'

export default async function SupporterTicketsPage() {
  const result = await getTicketOrders()
  return <SupporterTicketsClient data={result.data} />
}
