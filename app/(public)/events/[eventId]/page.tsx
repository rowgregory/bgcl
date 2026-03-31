import { PublicEventDetailsClient } from '@/app/components/pages/PublicEventDetailsClient'
import { getEventById } from '@/app/lib/actions/getEventById'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'
import { getUserAddress } from '@/app/lib/actions/getUserAddress'
import { getUserName } from '@/app/lib/actions/getUserName'

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params

  const [data, name, paymentMethods, address] = await Promise.all([
    getEventById(eventId),
    getUserName().catch(() => null),
    getSavedPaymentMethods().catch(() => ({ data: [] })),
    getUserAddress().catch(() => null)
  ])

  return (
    <PublicEventDetailsClient
      data={data}
      name={name?.data}
      savedCards={paymentMethods?.data ?? []}
      address={address?.data}
    />
  )
}
