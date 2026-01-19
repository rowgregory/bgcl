import StoriesClient from '@/app/components/pages/StoriesClient'
import { getNewsAndTeamMembers } from '@/app/lib/actions/getNewsAndTeamMembers'

export default async function StoriesPage() {
  const newsAndTeamMembers = await getNewsAndTeamMembers()
  return <StoriesClient newsAndTeamMembers={newsAndTeamMembers} />
}
