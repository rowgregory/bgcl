import PublicPartnersClient from '@/components/pages/PublicPartnersClient'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'
import { getPartners } from '@/lib/actions/partner/getPartners'

export default async function PublicPartnerPage() {
  const [partners, pageData] = await Promise.all([getPartners(), getPageBySlugClient('partner')])
  return <PublicPartnersClient partners={partners} pageData={pageData} />
}
