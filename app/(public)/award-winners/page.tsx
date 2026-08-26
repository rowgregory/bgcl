import AwardWinnersClient from '@/app/(public)/award-winners/AwardWinnersClient'
import { getNewsAndTeamMembers } from '@/lib/actions/_infra/getNewsAndTeamMembers'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'
import { getPrograms } from '@/lib/actions/program/getPrograms'

export const dynamic = 'force-dynamic'

export default async function AwardWinnersPage() {
  const [newsAndTeamMembers, pageData, programsResult] = await Promise.all([
    getNewsAndTeamMembers(),
    getPageBySlugClient('award-winner'),
    getPrograms()
  ])
  return (
    <AwardWinnersClient newsAndTeamMembers={newsAndTeamMembers} pageData={pageData} programs={programsResult.data} />
  )
}
