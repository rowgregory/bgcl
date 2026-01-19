'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export interface CreateSubscriberInput {
  email: string
  type: 'member' | 'non-member' | 'donor'
}

export async function createSubscriber(data: CreateSubscriberInput) {
  try {
    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: data.email }
    })

    if (existingSubscriber) {
      return {
        success: false,
        error: 'Email already subscribed'
      }
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email: data.email,
        type: data.type
      }
    })

    revalidateTag('Subscriber', 'default')

    return {
      success: true,
      data: subscriber,
      message: 'Subscriber created successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to create subscriber',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          email: data.email
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscriber'
    }
  }
}
