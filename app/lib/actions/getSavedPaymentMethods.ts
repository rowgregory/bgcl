'use server'

import prisma from '@/prisma/client'

export async function getSavedPaymentMethods(userId: string) {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    })

    return {
      success: true,
      paymentMethods: paymentMethods.map((pm) => ({
        id: pm.id,
        stripePaymentId: pm.stripePaymentId,
        brand: pm.cardBrand,
        last4: pm.cardLast4,
        expMonth: pm.cardExpMonth,
        expYear: pm.cardExpYear,
        isDefault: pm.isDefault
      }))
    }
  } catch (error) {
    console.error('Error getting payment methods:', error)
    return {
      success: false,
      error: 'Failed to retrieve payment methods'
    }
  }
}
