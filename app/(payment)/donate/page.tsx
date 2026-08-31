import { getCampaigns } from '@/lib/actions/campaign/getCampaigns'
import { getPhoneNumber } from '@/lib/actions/user/getPhoneNumber'
import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'
import { auth } from '@/lib/auth/auth'
import { DonateCheckoutClient } from './DonateCheckoutClient'

export default async function DonateCheckoutPage() {
  const session = await auth()
  const isAuthed = Boolean(session?.user?.id)

  const [campaigns, name, address, paymentMethods, phone] = await Promise.all([
    getCampaigns(),
    isAuthed ? getUserName() : null,
    isAuthed ? getUserAddress() : null,
    isAuthed ? getSavedPaymentMethods() : null,
    isAuthed ? getPhoneNumber() : null
  ])

  return (
    <DonateCheckoutClient
      campaigns={campaigns?.data ?? []}
      name={name?.data ?? null}
      address={address?.data ?? null}
      savedCards={paymentMethods?.data ?? []}
      phone={phone?.data ?? null}
      isAuthed={isAuthed}
    />
  )
}
