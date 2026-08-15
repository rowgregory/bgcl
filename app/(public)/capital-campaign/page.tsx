import PublicCapitalCampaignClient from '@/app/(public)/capital-campaign/PublicCapitalCampaignClient'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'

const dynamic = 'force-dynamic'

export default async function PublicCapitalCampaignPage() {
  const pageData = await getPageBySlugClient('capital')
  return <PublicCapitalCampaignClient pageData={pageData} />
}
