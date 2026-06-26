import { TeamClient } from '@/app/components/pages/TeamClient'
import { getPageBySlugClient } from '@/app/lib/actions/page/getPageBySlugClient'
import { getTeamMembers } from '@/app/lib/actions/team-member/getTeamMembers'

export default async function PublicTeamPage() {
  const team = await getTeamMembers()
  const pageData = await getPageBySlugClient('team')
  return <TeamClient team={team} pageData={pageData} />
}
