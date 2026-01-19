'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function deleteSubscriber(id: string) {
  try {
    await prisma.subscriber.delete({
      where: { id }
    })

    revalidateTag('Subscriber', 'default')

    return {
      success: true,
      message: 'Subscriber deleted successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to delete subscriber',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          subscriberId: id
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete subscriber'
    }
  }
}
