'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { revalidatePath } from 'next/cache'

export async function deleteResource(id: string) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id }
    })

    if (!resource) {
      await createLog('warn', 'Club resource not found for deletion', {
        resourceId: id
      })
      return { success: false, error: 'Club resource not found', status: 404 }
    }

    await prisma.resource.delete({
      where: { id }
    })

    await createLog('info', 'Club resource deleted successfully', {
      resourceId: resource.id,
      title: resource.title
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete club resource', {
      error: error instanceof Error ? error.message : 'Unknown error',
      resourceId: id
    })

    return {
      success: false,
      error: 'Failed to delete club resource. Please try again.'
    }
  }
}
