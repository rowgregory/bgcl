import { getPhoneNumber } from '@/lib/actions/user/getPhoneNumber'
import { getSavedPaymentMethods } from '@/lib/actions/stripe/getSavedPaymentMethods'
import { getSupporterDashboard } from '@/lib/actions/_dashboard/getSupporterDashboard'
import { getUserAddress } from '@/lib/actions/user/getUserAddress'
import { getUserName } from '@/lib/actions/user/getUserName'
import SupporterOverviewClient from './SupporterOverviewClient'

export default async function SupporterOverviewPage() {
  const [dashboardResult, addressResult, nameResult, paymentMethodsResult, phoneResult] = await Promise.all([
    getSupporterDashboard(),
    getUserAddress(),
    getUserName(),
    getSavedPaymentMethods(),
    getPhoneNumber()
  ])

  return (
    <SupporterOverviewClient
      dashboard={dashboardResult.data}
      address={addressResult.data}
      name={nameResult.data}
      savedCards={paymentMethodsResult?.data}
      phone={phoneResult.data}
    />
  )
}
