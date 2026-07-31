import PublicCapitalCampaignClient from '@/app/(public)/capital-campaign/PublicCapitalCampaignClient'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'

export default async function PublicCapitalCampaignPage() {
  const [pageData] = await Promise.all([getPageBySlugClient('capital')])
  return <PublicCapitalCampaignClient pageData={pageData} />
}
