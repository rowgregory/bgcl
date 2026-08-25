'use server'

import Stripe from 'stripe'

import prisma from '@/prisma/client'
import { stripe } from '@/lib/stripe/stripeClient'
import { createLog } from '@/lib/actions/log/createLog'
import { getOrCreateStripeCustomer } from './getOrCreateStripeCustomer'
import { savePaymentMethodSchema } from '@/lib/validations/payment-method.validation'
import { requireUser } from '@/lib/utils/requireAdmin'

export async function savePaymentMethod(input: unknown) {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  const userId = auth.user.id
  const parsed = savePaymentMethodSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      data: null,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid payment method'
    }
  }

  const { stripePaymentId, isDefault } = parsed.data

  try {
    const stripeCustomerId = await getOrCreateStripeCustomer(userId)

    const paymentMethod = await stripe.paymentMethods.retrieve(stripePaymentId)

    // Verify the payment method actually belongs to this user's Stripe customer
    if (paymentMethod.customer !== stripeCustomerId) {
      await createLog('warn', 'Payment method ownership mismatch', { userId, stripePaymentId })
      return { success: false, data: null, error: 'That payment method could not be verified.' }
    }

    const card = paymentMethod.card

    if (!card) {
      return { success: false, data: null, error: 'Only card payment methods are supported.' }
    }

    const saved = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.paymentMethod.count({
        where: { userId, stripePaymentId: { not: stripePaymentId } }
      })

      // A user's first card is always their default
      const shouldBeDefault = isDefault || existingCount === 0

      if (shouldBeDefault) {
        await tx.paymentMethod.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false }
        })
      }

      return tx.paymentMethod.upsert({
        where: { stripePaymentId },
        update: { isDefault: shouldBeDefault, userId },
        create: {
          stripePaymentId,
          cardholderName: paymentMethod.billing_details?.name ?? null,
          cardBrand: card.brand,
          cardLast4: card.last4,
          cardExpMonth: card.exp_month,
          cardExpYear: card.exp_year,
          isDefault: shouldBeDefault,
          userId
        }
      })
    })

    // Keep Stripe in step, so subscriptions and invoices bill the right card.
    // Outside the transaction: a Prisma rollback can't undo a Stripe write.
    if (saved.isDefault) {
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: { default_payment_method: stripePaymentId }
      })
    }

    await createLog('info', 'Payment method saved', {
      userId,
      paymentMethodId: saved.id,
      cardBrand: saved.cardBrand,
      cardLast4: saved.cardLast4
    })

    return { success: true, data: saved, error: null }
  } catch (error) {
    await createLog('error', 'Failed to save payment method', {
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    return { success: false, data: null, error: 'Failed to save payment method. Please try again.' }
  }
}
