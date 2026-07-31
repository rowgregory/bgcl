import { getPrograms } from '@/lib/actions/program/getPrograms'
import { getClubResources } from '@/lib/actions/club-resource/getClubResources'
import { ProgramsClient } from '@/components/pages/ProgramsClient'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'

export default async function PublicProgramsPage() {
  const [programs, resources, pageData] = await Promise.all([
    getPrograms(true),
    getClubResources(),
    getPageBySlugClient('program')
  ])

  return <ProgramsClient programs={programs} resources={resources} pageData={pageData} />
}
