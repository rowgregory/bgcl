import { TeamClient } from '@/app/(public)/team/TeamClient'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'
import { getTeamMembers } from '@/lib/actions/team-member/getTeamMembers'

export default async function PublicTeamPage() {
  const team = await getTeamMembers()
  const pageData = await getPageBySlugClient('team')
  return <TeamClient team={team} pageData={pageData} />
}
