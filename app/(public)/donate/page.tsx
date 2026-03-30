import { PublicDonateClient } from '@/app/components/pages/PublicDonateClient'
import { getCampaigns } from '@/app/lib/actions/getCampaigns'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'
import { getUserAddress } from '@/app/lib/actions/getUserAddress'
import { getUserName } from '@/app/lib/actions/getUserName'

export default async function DonatePage() {
  const [campaigns, name, address, paymentMethods] = await Promise.all([
    getCampaigns(),
    getUserName(),
    getUserAddress(),
    getSavedPaymentMethods()
  ])

  return (
    <PublicDonateClient
      campaigns={campaigns}
      name={name?.data}
      address={address?.data}
      savedCards={paymentMethods?.data}
    />
  )
}
