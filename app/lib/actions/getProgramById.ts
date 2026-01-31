import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getProgramById = async (id: string) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id }
    })

    if (!program) {
      await createLog('warn', 'Program not found', {
        programId: id
      })
      return { program: null, error: null }
    }

    return { program, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch program by id', {
      error: error instanceof Error ? error.message : 'Unknown error',
      programId: id
    })

    return {
      program: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
