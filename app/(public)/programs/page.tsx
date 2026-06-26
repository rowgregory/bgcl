import { getPrograms } from '@/app/lib/actions/program/getPrograms'
import { getClubResources } from '@/app/lib/actions/club-resource/getClubResources'
import { ProgramsClient } from '@/app/components/pages/ProgramsClient'
import { getPageBySlugClient } from '@/app/lib/actions/page/getPageBySlugClient'

export default async function PublicProgramsPage() {
  const [programs, resources, pageData] = await Promise.all([
    getPrograms(true),
    getClubResources(),
    getPageBySlugClient('program')
  ])

  return <ProgramsClient programs={programs} resources={resources} pageData={pageData} />
}
