'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { resourceSchema } from '@/lib/validations/resource.validation'

export async function updateResource(id: string, input: unknown) {
  if (!id) {
    return { success: false, error: 'Resource ID is required.' }
  }

  const parsed = resourceSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid resource data'
    }
  }

  const data = parsed.data

  try {
    // `order` is managed by drag-to-reorder, so it isn't touched here
    await prisma.resource.update({
      where: { id },
      data: {
        title: data.title,
        url: data.url
      }
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update resource', {
      resourceId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update resource. Please try again.'
    }
  }
}
