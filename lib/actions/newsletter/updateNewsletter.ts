'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { newsletterSchema } from '@/lib/validations/newsletter.validation'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function updateNewsletter(id: string, input: unknown) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  if (!id) return { success: false, error: 'Newsletter ID is required.' }

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
    // `order` is managed by drag-to-reorder, so it isn't touched here
    const newsletter = await prisma.newsletter.update({
      where: { id },
      data: {
        month: data.month,
        year: data.year,
        pdfUrl: data.pdfUrl
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Newsletter updated', {
      newsletterId: newsletter.id,
      month: newsletter.month,
      year: newsletter.year
    })

    return { success: true, data: newsletter, error: null }
  } catch (error) {
    // month_year is @@unique
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return {
        success: false,
        error: `Newsletter for ${data.month} ${data.year} already exists`
      }
    }

    await createLog('error', 'Failed to update newsletter', {
      newsletterId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      data: null,
      error: 'Failed to update newsletter. Please try again.'
    }
  }
}
