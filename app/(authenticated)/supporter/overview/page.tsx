import SupporterOverviewClient from '@/app/components/pages/SupporterOverviewClient'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'
import { getSupporterDashboard } from '@/app/lib/actions/getSupporterDashboard'
import { getUserAddress } from '@/app/lib/actions/getUserAddress'
import { getUserName } from '@/app/lib/actions/getUserName'

export const dynamic = 'force-dynamic'

export default async function SupporterOverviewPage() {
  const [dashboard, address, name, paymentMethods] = await Promise.all([
    getSupporterDashboard(),
    getUserAddress(),
    getUserName(),
    getSavedPaymentMethods()
  ])

  return (
    <SupporterOverviewClient
      dashboard={dashboard}
      address={address?.data}
      name={name?.data}
      savedCards={paymentMethods?.data}
    />
  )
}
