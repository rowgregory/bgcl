import AwardWinnersClient from '@/app/(public)/award-winners/AwardWinnersClient'
import { getNewsAndTeamMembers } from '@/lib/actions/_infra/getNewsAndTeamMembers'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'

export const dynamic = 'force-dynamic'

export default async function AwardWinnersPage() {
  const [newsAndTeamMembers, pageData] = await Promise.all([
    getNewsAndTeamMembers(),
    getPageBySlugClient('award-winner')
  ])
  return <AwardWinnersClient newsAndTeamMembers={newsAndTeamMembers} pageData={pageData} />
}
