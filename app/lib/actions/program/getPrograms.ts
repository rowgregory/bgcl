import prisma from '@/prisma/client'
import { IProgram } from '@/types/entities/program'
import { createLog } from '../log/createLog'

export async function getPrograms(isListed?: boolean): Promise<IProgram[]> {
  try {
    const programs = await prisma.program.findMany({
      where: isListed !== undefined ? { isListed } : undefined,
      orderBy: { order: 'asc' }
    })

    const formattedPrograms = programs.map((program) => ({
      ...program,
      descriptions: Array.isArray(program.descriptions) ? program.descriptions : []
    })) as IProgram[]

    return formattedPrograms
  } catch (error) {
    await createLog('error', 'Failed to fetch programs', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
