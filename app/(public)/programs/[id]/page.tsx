import ProgramDetailsClient from '@/app/components/pages/ProgramDetailsClient'
import { getClosings } from '@/app/lib/actions/getClosings'
import { getProgramById } from '@/app/lib/actions/getProgramById'
import { IProgram } from '@/types/entities/program'

export default async function ProgramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { program } = await getProgramById(id)
  const closings = await getClosings()

  const normalizedProgram: IProgram = {
    ...program,
    ...(program?.descriptions && {
      descriptions: Array.isArray(program?.descriptions) ? (program?.descriptions as string[]) : []
    })
  }

  return <ProgramDetailsClient program={normalizedProgram} closings={closings} />
}
