import { PublicTicketCheckoutClient } from '@/app/(public)/checkout/PublicTicketCheckoutClient'
import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'
import { auth } from '@/lib/auth/auth'

export default async function PublicCheckoutPage() {
  const session = await auth()

  const [savedPaymentMethods, userAddress, userName] = await Promise.all([
    session?.user?.id ? getSavedPaymentMethods() : Promise.resolve({ success: true, data: [] }),
    getUserAddress(),
    getUserName()
  ])

  return (
    <PublicTicketCheckoutClient
      savedCards={savedPaymentMethods.data ?? []}
      userAddress={userAddress?.data}
      userName={userName?.data}
    />
  )
}
