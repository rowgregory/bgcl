import { PublicEventDetailsClient } from '@/app/(public)/events/[eventId]/PublicEventDetailsClient'
import { getEventById } from '@/lib/actions/event/getEventById'
import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'

export const dynamic = 'force-dynamic'

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params

  const [event, name, paymentMethods, address] = await Promise.all([
    getEventById(eventId),
    getUserName().catch(() => null),
    getSavedPaymentMethods().catch(() => ({ data: [] })),
    getUserAddress().catch(() => null)
  ])

  return (
    <PublicEventDetailsClient
      data={event.data}
      name={name?.data}
      savedCards={paymentMethods?.data ?? []}
      address={address?.data}
    />
  )
}
