'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteProgram(id: string) {
  try {
    const program = await prisma.program.findUnique({
      where: { id }
    })

    if (!program) {
      await createLog('warn', 'Program not found for deletion', {
        programId: id
      })
      return { success: false, error: 'Program not found', status: 404 }
    }

    await prisma.program.delete({
      where: { id }
    })

    await createLog('info', 'Program deleted successfully', {
      programId: program.id,
      name: program.name
    })

    revalidateTag('Program', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete program', {
      error: error instanceof Error ? error.message : 'Unknown error',
      programId: id
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete program',
      status: 500
    }
  }
}
