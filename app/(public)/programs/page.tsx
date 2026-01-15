import { getPrograms } from '@/app/lib/actions/getPrograms'
import ProgramsClient from '@/app/components/pages/ProgramsClient'

export default async function ProgramsPage() {
  const programs = await getPrograms()
  return <ProgramsClient programs={programs} />
}
