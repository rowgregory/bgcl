'use server'

import prisma from '@/prisma/client'
import { CreateNewsletterInput } from './createNewsletter'
import { revalidateTag } from 'next/cache'

export interface UpdateNewsletterInput extends CreateNewsletterInput {
  id: string
}

export async function updateNewsletter(data: UpdateNewsletterInput) {
  try {
    const newsletter = await prisma.newsletter.update({
      where: { id: data.id },
      data: {
        month: data.month,
        year: Number(data.year),
        pdfUrl: data.pdfUrl,
        order: data.order
      }
    })

    revalidateTag('Newsletter', 'default')

    return {
      success: true,
      data: newsletter,
      message: 'Newsletter updated successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to update newsletter',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          newsletterId: data.id
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update newsletter'
    }
  }
}
