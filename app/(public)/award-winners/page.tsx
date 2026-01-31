import AwardWinnersClient from '@/app/components/pages/AwardWinnersClient'
import { getNewsAndTeamMembers } from '@/app/lib/actions/getNewsAndTeamMembers'

export default async function AwardWinnersPage() {
  const newsAndTeamMembers = await getNewsAndTeamMembers()
  return <AwardWinnersClient newsAndTeamMembers={newsAndTeamMembers} />
}
