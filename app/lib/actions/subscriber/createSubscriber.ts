'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { CreateSubscriberInput } from '@/types/entities/subscriber'

export async function createSubscriber(data: CreateSubscriberInput) {
  try {
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: data.email }
    })

    if (existingSubscriber) {
      return {
        success: true
      }
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email: data.email,
        type: data.type
      }
    })

    return {
      success: true,
      data: subscriber,
      message: 'Subscriber created successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to create subscriber', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email: data.email
    })

    return {
      success: false,
      error: 'Failed to create subscriber. Please try again.'
    }
  }
}
