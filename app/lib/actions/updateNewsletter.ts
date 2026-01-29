'use server'

import prisma from '@/prisma/client'
import { CreateNewsletterInput } from './createNewsletter'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export interface UpdateNewsletterInput extends CreateNewsletterInput {
  id: string
}

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

    revalidateTag('Newsletter', 'default')

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
