import ProgramDetailsClient from '@/app/components/pages/ProgramDetailsClient'
import { getProgramById } from '@/app/lib/actions/getProgramById'

export default async function ProgramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { program } = await getProgramById(id)
  return <ProgramDetailsClient program={program} />
}
