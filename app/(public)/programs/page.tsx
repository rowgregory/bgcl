import { getPrograms } from '@/lib/actions/program/getPrograms'
import { ProgramsClient } from '@/app/(public)/programs/ProgramsClient'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'
import { getResources } from '@/lib/actions/resource/getResources'

export default async function PublicProgramsPage() {
  const [programs, resources, pageData] = await Promise.all([
    getPrograms(true),
    getResources(),
    getPageBySlugClient('program')
  ])

  return <ProgramsClient programs={programs} resources={resources} pageData={pageData} />
}
