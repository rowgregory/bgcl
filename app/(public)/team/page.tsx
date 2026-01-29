import { TeamClient } from '@/app/components/pages/TeamClient'
import { getTeamMembers } from '@/app/lib/actions/getTeamMembers'

export default async function TeamPage() {
  const team = await getTeamMembers()
  return <TeamClient team={team} />
}
