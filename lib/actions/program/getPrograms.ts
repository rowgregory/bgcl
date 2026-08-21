import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { Program } from '@prisma/client'

export async function getPrograms(isListed?: boolean) {
  try {
    const programs = await prisma.program.findMany({
      where: isListed !== undefined ? { isListed } : undefined,
      orderBy: { order: 'asc' }
    })

    const formattedPrograms = programs.map((program) => ({
      ...program,
      descriptions: Array.isArray(program.descriptions) ? program.descriptions : []
    })) as Program[]

    return { success: false, data: formattedPrograms, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch programs', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load programs' }
  }
}
