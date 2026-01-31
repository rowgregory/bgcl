import { getPrograms } from '@/app/lib/actions/getPrograms'
import ProgramsClient from '@/app/components/pages/ProgramsClient'
import { getClubResources } from '@/app/lib/actions/getClubResources'

export default async function ProgramsPage() {
  const programs = await getPrograms(true)
  const resources = await getClubResources()
  return <ProgramsClient programs={programs} resources={resources} />
}
