'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function updateProgramsOrder(
  programs: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      programs.map((program, index) =>
        prisma.program.update({
          where: { id: program.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidateTag('Program', 'default')
    return { success: true }
  } catch (error) {
    console.error('Error reordering programs:', error)
    return { success: false, error: 'Failed to reorder programs' }
  }
}
