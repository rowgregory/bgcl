import PublicCapitalCampaignClient from '@/app/components/pages/PublicCapitalCampaignClient'
import { getPageBySlugClient } from '@/app/lib/actions/page/getPageBySlugClient'

export default async function PublicCapitalCampaignPage() {
  const [pageData] = await Promise.all([getPageBySlugClient('capital')])
  return <PublicCapitalCampaignClient pageData={pageData} />
}
