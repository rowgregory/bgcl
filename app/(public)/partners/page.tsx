import PublicPartnersClient from '@/app/components/pages/PublicPartnersClient'
import { getPageBySlugClient } from '@/app/lib/actions/page/getPageBySlugClient'
import { getPartners } from '@/app/lib/actions/partner/getPartners'

export default async function PublicPartnerPage() {
  const [partners, pageData] = await Promise.all([getPartners(), getPageBySlugClient('partner')])
  return <PublicPartnersClient partners={partners} pageData={pageData} />
}
