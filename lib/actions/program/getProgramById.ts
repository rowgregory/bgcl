import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export const getProgramById = async (id: string) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id }
    })

    if (!program) return { success: false, data: null, error: null }

    return { success: true, data: program, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch program by id', {
      error: error instanceof Error ? error.message : 'Unknown error',
      programId: id
    })

    return {
      success: false,
      data: null,
      error: 'Could not load program'
    }
  }
}
