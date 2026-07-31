'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'

export async function reorderNewsletters(
  newsletters: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      newsletters.map((newsletter, index) =>
        prisma.newsletter.update({
          where: { id: newsletter.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder newsletters', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to reorder newsletters. Please try again.' }
  }
}
