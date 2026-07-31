'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { UpdateNewsletterInput } from '@/types/entities/newsletter'
import { revalidatePath } from 'next/cache'

export async function updateNewsletter(data: UpdateNewsletterInput) {
  try {
    await prisma.newsletter.update({
      where: { id: data.id },
      data: {
        month: data.month,
        year: Number(data.year),
        pdfUrl: data.pdfUrl,
        order: data.order
      }
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update newsletter', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update newsletter. Please try again.'
    }
  }
}
