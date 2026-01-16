import { TeamClient } from '@/app/components/pages/TeamClient'
import { getAllTeamMembers } from '@/app/lib/actions/getAllTeamMembers'

export default async function TeamPage() {
  const team = await getAllTeamMembers()
  return <TeamClient team={team} />
}
