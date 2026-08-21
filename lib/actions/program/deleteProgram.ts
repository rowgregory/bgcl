'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deleteProgram(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

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

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete program', {
      error: error instanceof Error ? error.message : 'Unknown error',
      programId: id
    })

    return {
      success: false,
      error: 'Failed to delete program. Please try again.'
    }
  }
}
