import PublicPartnersClient from '@/app/components/pages/PublicPartnersClient'
import { getPartners } from '@/app/lib/actions/getPartners'

export default async function PublicPartnerPage() {
  const data = await getPartners()
  return <PublicPartnersClient partners={data} />
}
