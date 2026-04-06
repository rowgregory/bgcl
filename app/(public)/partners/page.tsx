import PublicPartnersClient from '@/app/components/pages/PublicPartnersClient'
import { getPageBySlugClient } from '@/app/lib/actions/getPageBySlugClient'
import { getPartners } from '@/app/lib/actions/getPartners'

export default async function PublicPartnerPage() {
  const [partners, pageData] = await Promise.all([getPartners(), getPageBySlugClient('partner')])
  return <PublicPartnersClient partners={partners} pageData={pageData} />
}
