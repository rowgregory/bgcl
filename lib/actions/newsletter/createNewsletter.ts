'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { newsletterSchema } from '@/lib/validations/newsletter.validation'

export async function createNewsletter(input: unknown) {
  const parsed = newsletterSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid newsletter data'
    }
  }

  const data = parsed.data

  try {
    const existing = await prisma.newsletter.findUnique({
      where: { month_year: { month: data.month, year: data.year } },
      select: { id: true }
    })

    if (existing) {
      return {
        success: false,
        data: null,
        error: `Newsletter for ${data.month} ${data.year} already exists`
      }
    }

    // Place new newsletters at the end of the list
    const lastNewsletter = await prisma.newsletter.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const newsletter = await prisma.newsletter.create({
      data: {
        month: data.month,
        year: data.year,
        pdfUrl: data.pdfUrl,
        order: (lastNewsletter?.order ?? -1) + 1
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Newsletter created', {
      newsletterId: newsletter.id,
      month: newsletter.month,
      year: newsletter.year
    })

    return { success: true }
  } catch (error) {
    // month_year is @@unique — covers the race with the check above
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return {
        success: false,
        error: `Newsletter for ${data.month} ${data.year} already exists`
      }
    }

    await createLog('error', 'Failed to create newsletter', {
      month: data.month,
      year: data.year,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      data: null,
      error: 'Failed to create newsletter. Please try again.'
    }
  }
}
