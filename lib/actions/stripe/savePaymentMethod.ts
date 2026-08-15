'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth/auth'
import { stripe } from '../../stripe/stripeClient'
import { createLog } from '../log/createLog'
import { savePaymentMethodSchema } from '@/lib/validations/payment-method.validation'

export async function savePaymentMethod(input: unknown) {
  // The user comes from the session, never from the caller
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const userId = session.user.id

  const parsed = savePaymentMethodSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid payment method'
    }
  }

  const { stripePaymentId, isDefault } = parsed.data

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })

    if (!user?.stripeCustomerId) {
      return { success: false, error: 'Customer not found.' }
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(stripePaymentId)

    // Verify the payment method actually belongs to this user's Stripe customer
    if (paymentMethod.customer !== user.stripeCustomerId) {
      await createLog('warn', 'Payment method ownership mismatch', {
        userId,
        stripePaymentId
      })
      return { success: false, error: 'That payment method could not be verified.' }
    }

    if (!paymentMethod.card) {
      return { success: false, error: 'Only card payment methods are supported.' }
    }

    const saved = await prisma.$transaction(async (tx) => {
      // Only one default per user
      if (isDefault) {
        await tx.paymentMethod.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false }
        })
      }

      return tx.paymentMethod.upsert({
        where: { stripePaymentId },
        update: { isDefault },
        create: {
          stripePaymentId,
          cardholderName: paymentMethod.billing_details?.name ?? null,
          cardBrand: paymentMethod.card!.brand,
          cardLast4: paymentMethod.card!.last4,
          cardExpMonth: paymentMethod.card!.exp_month,
          cardExpYear: paymentMethod.card!.exp_year,
          isDefault,
          userId
        }
      })
    })

    await createLog('info', 'Payment method saved', {
      userId,
      paymentMethodId: saved.id,
      cardBrand: saved.cardBrand,
      cardLast4: saved.cardLast4
    })

    return { success: true, data: saved }
  } catch (error) {
    await createLog('error', 'Failed to save payment method', {
      userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to save payment method. Please try again.' }
  }
}
