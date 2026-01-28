import YearlyDonationsClient from '@/app/components/pages/YearlyDonationsClient'
import { getRecurringYearlyDonations } from '@/app/lib/actions/getRecurringYearlyDonations'

export default async function FuelTankYearlyDonations() {
  const yearlyDonations = await getRecurringYearlyDonations()
  return <YearlyDonationsClient yearlyDonations={yearlyDonations} />
}
