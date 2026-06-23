'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { revalidatePath } from 'next/cache'

export async function reorderPrograms(programs: Array<{ id: string; order?: number }>) {
  try {
    await Promise.all(
      programs.map((program, index) =>
        prisma.program.update({
          where: { id: program.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder programs', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to reorder programs. Please try again.'
    }
  }
}
