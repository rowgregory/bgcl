import { getPrograms } from '@/app/lib/actions/getPrograms'
import { getClubResources } from '@/app/lib/actions/getClubResources'
import { ProgramsClient } from '@/app/components/pages/ProgramsClient'

export default async function ProgramsPage() {
  const programs = await getPrograms(true)
  const resources = await getClubResources()
  return <ProgramsClient programs={programs} resources={resources} />
}
