import { getCampaigns } from '@/lib/actions/campaign/getCampaigns'
import { getPhoneNumber } from '@/lib/actions/user/getPhoneNumber'
import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'
import { PublicDonateClient } from './PublicDonateClient'
import { auth } from '@/lib/auth/auth'

export default async function DonatePage() {
  const [campaigns, name, address, paymentMethods, phone, session] = await Promise.all([
    getCampaigns(),
    getUserName(),
    getUserAddress(),
    getSavedPaymentMethods(),
    getPhoneNumber(),
    auth()
  ])

  return (
    <PublicDonateClient
      campaigns={campaigns.data}
      name={name?.data}
      address={address?.data}
      savedCards={paymentMethods?.data ?? []}
      phone={phone?.data}
      isAuthed={!!session?.user}
    />
  )
}
