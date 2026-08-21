'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deleteResource(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const resource = await prisma.resource.findUnique({
      where: { id }
    })

    if (!resource) {
      await createLog('warn', 'Resource not found for deletion', {
        resourceId: id
      })
      return { success: false, error: 'Resource not found', status: 404 }
    }

    await prisma.resource.delete({
      where: { id }
    })

    await createLog('info', 'Resource deleted successfully', {
      resourceId: resource.id,
      title: resource.title
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete resource', {
      error: error instanceof Error ? error.message : 'Unknown error',
      resourceId: id
    })

    return {
      success: false,
      error: 'Failed to delete resource. Please try again.'
    }
  }
}
