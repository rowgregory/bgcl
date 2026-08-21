import { PublicDonateClient } from '@/app/(public)/donate/PublicDonateClient'
import { getCampaigns } from '@/lib/actions/campaign/getCampaigns'
import { getPhoneNumber } from '@/lib/actions/user/getPhoneNumber'
import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'

export const dynamic = 'force-dynamic'

export default async function DonatePage() {
  const [campaigns, name, address, paymentMethods, phone] = await Promise.all([
    getCampaigns(),
    getUserName(),
    getUserAddress(),
    getSavedPaymentMethods(),
    getPhoneNumber()
  ])

  return (
    <PublicDonateClient
      campaigns={campaigns.data}
      name={name?.data}
      address={address?.data}
      savedCards={paymentMethods?.data ?? []}
      phone={phone?.data}
    />
  )
}
