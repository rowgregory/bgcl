import TransmissionsClient from '@/components/pages/TransmissionsClient'
import { getContactSubmissions } from '@/lib/actions/contact-submission/getContactSubmissions'

export default async function TransmissionsPage() {
  const transmissions = await getContactSubmissions()
  return <TransmissionsClient transmissions={transmissions} />
}
