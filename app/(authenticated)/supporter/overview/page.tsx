import SupporterOverviewClient from '@/app/(authenticated)/supporter/overview/SupporterOverviewClient'
import { getPhoneNumber } from '@/lib/actions/user/getPhoneNumber'
import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getSupporterDashboard } from '@/lib/actions/_dashboard/getSupporterDashboard'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'

export const dynamic = 'force-dynamic'

export default async function SupporterOverviewPage() {
  const [dashboard, address, name, paymentMethods, phone] = await Promise.all([
    getSupporterDashboard(),
    getUserAddress(),
    getUserName(),
    getSavedPaymentMethods(),
    getPhoneNumber()
  ])

  return (
    <SupporterOverviewClient
      dashboard={dashboard}
      address={address?.data}
      name={name?.data}
      savedCards={paymentMethods?.data}
      phone={phone.data}
    />
  )
}
