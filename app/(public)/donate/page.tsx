import { PublicDonateClient } from '@/app/components/pages/PublicDonateClient'
import { getCampaigns } from '@/app/lib/actions/getCampaigns'
import { getPhoneNumber } from '@/app/lib/actions/getPhoneNumber'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'
import { getUserAddress } from '@/app/lib/actions/getUserAddress'
import { getUserName } from '@/app/lib/actions/getUserName'

export const dynamic = 'force-dynamic'

export default async function DonatePage() {
  const [campaigns, name, address, paymentMethods, phone] = await Promise.all([
    getCampaigns().catch(() => null),
    getUserName().catch(() => null),
    getUserAddress().catch(() => null),
    getSavedPaymentMethods().catch(() => ({ data: [] })),
    getPhoneNumber().catch(() => null)
  ])

  return (
    <PublicDonateClient
      campaigns={campaigns}
      name={name?.data}
      address={address?.data}
      savedCards={paymentMethods?.data ?? []}
      phone={phone?.data}
    />
  )
}
