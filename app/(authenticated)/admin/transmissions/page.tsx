import TransmissionsClient from '@/app/components/pages/TransmissionsClient'
import { getContactSubmissions } from '@/app/lib/actions/getContactSubmissions'

export default async function TransmissionsPage() {
  const transmissions = await getContactSubmissions()
  return <TransmissionsClient transmissions={transmissions} />
}
