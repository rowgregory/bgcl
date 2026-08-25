import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'
import { getUserPhone } from '@/lib/actions/user/getUserPhone'
import { auth } from '@/lib/auth/auth'
import { PublicTicketCheckoutClient } from './PublicTicketCheckoutClient'

export default async function PublicCheckoutPage() {
  const session = await auth()

  const [savedPaymentMethods, userAddress, userName, userPhone] = await Promise.all([
    session?.user?.id ? getSavedPaymentMethods() : Promise.resolve({ success: true, data: [] }),
    session?.user?.id ? getUserAddress() : Promise.resolve({ success: true, data: null }),
    session?.user?.id ? getUserName() : Promise.resolve({ success: true, data: null }),
    session?.user?.id ? getUserPhone() : Promise.resolve({ success: true, data: null })
  ])

  return (
    <PublicTicketCheckoutClient
      savedCards={savedPaymentMethods.data ?? []}
      userAddress={userAddress?.data ?? null}
      userName={userName?.data ?? null}
      userEmail={session?.user?.email ?? null}
      isAuthed={!!session?.user}
      userPhone={userPhone?.data ?? null}
    />
  )
}
