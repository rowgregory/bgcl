import MonthlyDonationsClient from '@/app/components/pages/MonthlyDonationsClient'
import { getRecurringMonthlyDonations } from '@/app/lib/actions/getRecurringMonthlyDonations'

export default async function FuelTankMonthlyDonations() {
  const monthlyDonations = await getRecurringMonthlyDonations()
  return <MonthlyDonationsClient monthlyDonations={monthlyDonations} />
}
