'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export interface CreateNewsletterInput {
  month: string
  year: number
  pdfUrl: string
  order: number
}

export async function getNextNewsletterOrder(): Promise<number> {
  try {
    const lastNewsletter = await prisma.newsletter.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    return (lastNewsletter?.order ?? 0) + 1
  } catch (error) {
    console.error('Failed to get next newsletter order:', error)
    return 0
  }
}

export async function createNewsletter(data: CreateNewsletterInput) {
  try {
    const order = await getNextNewsletterOrder()

    // Check if newsletter already exists for this month/year
    const existingNewsletter = await prisma.newsletter.findUnique({
      where: {
        month_year: {
          month: data.month,
          year: Number(data.year)
        }
      }
    })

    if (existingNewsletter) {
      return {
        success: false,
        error: `Newsletter for ${data.month} ${data.year} already exists`
      }
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        month: data.month,
        year: Number(data.year),
        pdfUrl: data.pdfUrl,
        order
      }
    })

    revalidateTag('Newsletter', 'default')

    return {
      success: true,
      data: newsletter,
      message: 'Newsletter created successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to create newsletter',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          month: data.month,
          year: data.year
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create newsletter'
    }
  }
}
