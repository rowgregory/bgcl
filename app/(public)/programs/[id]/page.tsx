import ProgramDetailsClient from '@/app/components/pages/ProgramDetailsClient'
import { getClosings } from '@/app/lib/actions/getClosings'
import { getProgramById } from '@/app/lib/actions/getProgramById'

export default async function ProgramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { program } = await getProgramById(id)
  const closings = await getClosings()
  return <ProgramDetailsClient program={program} closings={closings} />
}
