import { PublicEventDetailsClient } from '@/app/(public)/events/[eventId]/PublicEventDetailsClient'
import { getEventById } from '@/lib/actions/event/getEventById'
import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'
import { auth } from '@/lib/auth/auth'
import { notFound } from 'next/navigation'

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params

  const session = await auth()

  const [event, name, paymentMethods, address] = await Promise.all([
    getEventById(eventId),
    session ? getUserName() : null,
    session ? getSavedPaymentMethods() : null,
    session ? getUserAddress() : null
  ])

  if (!event?.data) notFound()

  return (
    <PublicEventDetailsClient
      data={event.data}
      name={name?.data}
      savedCards={paymentMethods?.data ?? []}
      address={address?.data}
    />
  )
}
