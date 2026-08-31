'use server'

import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { requireUser } from '@/lib/utils/requireAdmin'
import { stripe } from '@/lib/stripe/stripeClient'
import { createLog } from '../log/createLog'

export async function cancelStripeSubscription(
  subscriptionId: string,
  cancellationReason?: string,
  cancellationComment?: string
) {
  const auth = await requireUser()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    // Scoped to the caller, so nobody can cancel someone else's donation
    const order = await prisma.order.findFirst({
      where: {
        stripeSubscriptionId: subscriptionId,
        type: 'RECURRING_DONATION',
        OR: [{ userId: auth.user.id }, { customerEmail: auth.user.email }]
      },
      select: { id: true, userId: true, customerEmail: true, customerName: true, recurringFrequency: true }
    })

    if (!order) return { success: false, data: null, error: 'Subscription not found' }

    const cancelled = await stripe.subscriptions.cancel(subscriptionId, {
      cancellation_details: cancellationReason
        ? { comment: cancellationComment, feedback: cancellationReason as any }
        : undefined
    })

    // The status on each row records whether that charge collected, so it stays
    // as it is. handleSubscriptionDeleted stamps subscriptionCanceledAt when the
    // webhook lands; this write is here so the UI is correct immediately.
    await prisma.order.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        subscriptionCanceledAt: cancelled.canceled_at ? new Date(cancelled.canceled_at * 1000) : new Date(),
        subscriptionCancelsAt: null,
        nextBillingDate: null
      }
    })

    await createLog('info', 'Subscription cancelled by supporter', {
      subscriptionId,
      orderId: order.id,
      userId: order.userId,
      cancellationReason,
      cancellationComment,
      customerEmail: order.customerEmail,
      frequency: order.recurringFrequency
    })

    return {
      success: true,
      error: null,
      data: {
        subscriptionId: cancelled.id,
        status: cancelled.status,
        canceledAt: cancelled.canceled_at ? new Date(cancelled.canceled_at * 1000).toISOString() : null
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to cancel subscription', {
      subscriptionId,
      userId: auth.user.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    if (error instanceof Stripe.errors.StripeAuthenticationError) {
      return { success: false, data: null, error: 'Payment provider is not configured correctly.' }
    }

    return { success: false, data: null, error: 'Could not cancel your donation. Please try again.' }
  }
}
