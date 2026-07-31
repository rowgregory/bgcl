import { ProgramDetailsClient } from '@/app/(public)/programs/[id]/ProgramDetailsClient'
import { getClosings } from '@/lib/actions/closing/getClosings'
import { getProgramById } from '@/lib/actions/program/getProgramById'
import prisma from '@/prisma/client'
import { IProgram } from '@/types/entities/program'
import { redirect } from 'next/navigation'

export default async function ProgramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { program } = await getProgramById(id)
  const closings = await getClosings()

  // If not found by ID, try to find by slug/name (old URL structure)
  if (!program) {
    // Convert slug back to readable name: "camp-creighton" -> "camp creighton"
    const programName = id.replace(/-/g, ' ')

    const programBySlug = await prisma.program.findFirst({
      where: {
        name: {
          contains: programName,
          mode: 'insensitive'
        }
      }
    })

    if (programBySlug) {
      // Permanently redirect to the correct ID-based URL
      redirect(`/programs/${programBySlug.id}`)
    }
  }

  const normalizedProgram: IProgram = {
    ...program,
    ...(program?.descriptions && {
      descriptions: Array.isArray(program?.descriptions) ? (program?.descriptions as string[]) : []
    })
  }

  return <ProgramDetailsClient program={normalizedProgram} closings={closings} />
}
