import { ProgramDetailsClient } from '@/app/(public)/programs/[id]/ProgramDetailsClient'
import { getClosings } from '@/lib/actions/closing/getClosings'
import { getProgramById } from '@/lib/actions/program/getProgramById'
import { ProgramFormValues } from '@/lib/validations/program.validation'
import prisma from '@/prisma/client'
import { redirect } from 'next/navigation'

export default async function ProgramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const programResult = await getProgramById(id)
  const closingsResult = await getClosings()

  // If not found by ID, try to find by slug/name (old URL structure)
  if (!programResult.data) {
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

  const normalizedProgram: ProgramFormValues = {
    ...programResult.data,
    ...(programResult.data?.descriptions && {
      descriptions: Array.isArray(programResult.data?.descriptions)
        ? (programResult.data?.descriptions as string[])
        : []
    })
  }

  return <ProgramDetailsClient program={normalizedProgram} closings={closingsResult.data} />
}
