'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteNewsletter(id: string) {
  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
      select: { id: true, year: true, month: true }
    })

    if (!newsletter) {
      return {
        success: false,
        error: 'Newsletter not found'
      }
    }

    await prisma.newsletter.delete({
      where: { id }
    })

    await createLog('info', 'Newsletter deleted', {
      newsletterId: id,
      year: newsletter.year,
      month: newsletter.month
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete newsletter', {
      error: error instanceof Error ? error.message : 'Unknown error',
      newsletterId: id
    })

    return {
      success: false,
      error: 'Failed to delete newsletter. Please try again.'
    }
  }
}
