import { TheLibraryProgramsClient } from '@/app/components/pages/TheLibraryProgramsClient'
import { getPrograms } from '@/app/lib/actions/getPrograms'

export const metadata = {
  title: 'Programs - Admin'
}

export default async function TheLibraryProgramsPage() {
  const programs = await getPrograms()

  return <TheLibraryProgramsClient programs={programs} />
}
