import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'
import { getUserPhone } from '@/lib/actions/user/getUserPhone'
import { auth } from '@/lib/auth/auth'
import { TicketCheckoutClient } from './TicketCheckoutClient'
import { getUpcomingEventFlags } from '@/lib/actions/event/getUpcomingEventFlags'

export default async function TicketCheckoutPage() {
  const session = await auth()
  const isAuthed = Boolean(session?.user?.id)

  const [savedCards, address, name, phone, eventFlags] = await Promise.all([
    isAuthed ? getSavedPaymentMethods() : null,
    isAuthed ? getUserAddress() : null,
    isAuthed ? getUserName() : null,
    isAuthed ? getUserPhone() : null,
    getUpcomingEventFlags()
  ])

  return (
    <TicketCheckoutClient
      savedCards={savedCards?.data ?? []}
      userAddress={address?.data ?? null}
      userName={name?.data ?? null}
      userPhone={phone?.data ?? null}
      userEmail={session?.user?.email ?? null}
      isAuthed={isAuthed}
      showAttendingToggle={Boolean(eventFlags?.showAttendingToggle)}
    />
  )
}
