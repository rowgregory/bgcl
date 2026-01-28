import OneTimeDonationsClient from '@/app/components/pages/OneTimeDonationsClient'
import { getOneTimeDonations } from '@/app/lib/actions/getOneTimeDonations'

export default async function FuelTankOneTimeDonations() {
  const oneTimeDonations = await getOneTimeDonations()
  return <OneTimeDonationsClient oneTimeDonations={oneTimeDonations} />
}
