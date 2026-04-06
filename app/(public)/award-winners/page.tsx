import AwardWinnersClient from '@/app/components/pages/AwardWinnersClient'
import { getNewsAndTeamMembers } from '@/app/lib/actions/getNewsAndTeamMembers'
import { getPageBySlugClient } from '@/app/lib/actions/getPageBySlugClient'

export default async function AwardWinnersPage() {
  const [newsAndTeamMembers, pageData] = await Promise.all([
    getNewsAndTeamMembers(),
    getPageBySlugClient('award-winner')
  ])
  return <AwardWinnersClient newsAndTeamMembers={newsAndTeamMembers} pageData={pageData} />
}
