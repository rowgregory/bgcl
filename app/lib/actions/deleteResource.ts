'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteResource(id: string) {
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

    revalidateTag('Club-Resource', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete resource', {
      error: error instanceof Error ? error.message : 'Unknown error',
      resourceId: id
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete resource',
      status: 500
    }
  }
}
