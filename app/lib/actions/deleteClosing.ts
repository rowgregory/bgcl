'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function deleteClosing(id: string) {
  try {
    await prisma.closing.delete({
      where: { id }
    })

    revalidateTag('Closing', 'default')

    return {
      success: true,
      message: 'Closing deleted successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to delete closing',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          closingId: id
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete closing',
      message: 'Failed to delete closing'
    }
  }
}
