'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'
import { auth } from '../auth'

const getCachedPaymentMethods = unstable_cache(
  async (userId: string) => {
    return await prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        stripePaymentId: true,
        cardholderName: true,
        cardBrand: true,
        cardLast4: true,
        cardExpMonth: true,
        cardExpYear: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
        userId: true
      }
    })
  },
  ['getCachedPaymentMethods'], // Cache key
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ['Payment-Method'] // Cache tag for manual revalidation
  }
)

export async function getSavedPaymentMethods() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const paymentMethods = await getCachedPaymentMethods(session.user.id)

    return {
      success: true,
      data: paymentMethods
    }
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return {
      success: false,
      error: 'Failed to fetch payment methods'
    }
  }
}
