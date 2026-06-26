import SupporterOverviewClient from '@/app/components/pages/SupporterOverviewClient'
import { getPhoneNumber } from '@/app/lib/actions/user/getPhoneNumber'
import { getSavedPaymentMethods } from '@/app/lib/actions/stripe/getSavedPaymentMethods'
import { getSupporterDashboard } from '@/app/lib/actions/_dashboard/getSupporterDashboard'
import { getUserAddress } from '@/app/lib/actions/user/getUserAddress'
import { getUserName } from '@/app/lib/actions/user/getUserName'

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
