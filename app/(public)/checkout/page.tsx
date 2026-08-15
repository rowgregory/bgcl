import { PublicTicketCheckoutClient } from '@/app/(public)/checkout/PublicTicketCheckoutClient'
import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'
import { auth } from '@/lib/auth/auth'

export const dynamic = 'force-dynamic'

export default async function PublicCheckoutPage() {
  const session = await auth()

  const [savedPaymentMethods, userAddress, userName] = await Promise.all([
    session?.user?.id ? getSavedPaymentMethods() : Promise.resolve({ success: true, data: [] }),
    session?.user?.id ? getUserAddress() : Promise.resolve({ success: true, data: null }),
    session?.user?.id ? getUserName() : Promise.resolve({ success: true, data: null })
  ])

  return (
    <PublicTicketCheckoutClient
      savedCards={savedPaymentMethods.data ?? []}
      userAddress={userAddress?.data ?? null}
      userName={userName?.data ?? null}
    />
  )
}
