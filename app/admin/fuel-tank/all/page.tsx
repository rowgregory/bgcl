import AllDonationsClient from '@/app/components/pages/AllDonationsClient'
import { getDonations } from '@/app/lib/actions/getDonations'

export default async function FuelTankMonthlyDonations() {
  const donations = await getDonations()
  return <AllDonationsClient donations={donations} />
}
