import { PublicEventDetailsClient } from '@/app/components/pages/PublicEventDetailsClient'
import { getEventById } from '@/app/lib/actions/getEventById'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'
import { getUserName } from '@/app/lib/actions/getUserName'

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const [data, name, paymentMethods] = await Promise.all([
    getEventById(eventId),
    getUserName(),
    getSavedPaymentMethods()
  ])
  return <PublicEventDetailsClient data={data} name={name?.data} savedCards={paymentMethods?.data} />
}
