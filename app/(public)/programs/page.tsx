import { getPrograms } from '@/app/lib/actions/getPrograms'
import { getClubResources } from '@/app/lib/actions/getClubResources'
import { ProgramsClient } from '@/app/components/pages/ProgramsClient'
import { getPageBySlugClient } from '@/app/lib/actions/getPageBySlugClient'

export default async function PublicProgramsPage() {
  const [programs, resources, pageData] = await Promise.all([
    getPrograms(true),
    getClubResources(),
    getPageBySlugClient('program')
  ])

  return <ProgramsClient programs={programs} resources={resources} pageData={pageData} />
}
