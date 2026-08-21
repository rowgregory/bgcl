'use server'

import prisma from '@/prisma/client'
import { requireUser } from '@/lib/utils/requireAdmin'
import { stripe } from '@/lib/stripe/stripeClient'
import { createLog } from '../log/createLog'

/**
 * Cancel a Stripe subscription immediately and update the database
 * @param subscriptionId - Stripe subscription ID
 * @param cancellationReason - Reason for cancellation
 * @param cancellationComment - Additional feedback/comment
 * @returns The cancelled subscription
 */
export async function cancelStripeSubscription(
  subscriptionId: string,
  cancellationReason?: string,
  cancellationComment?: string
) {
  const auth = await requireUser()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    // Find the order in the database
    const order = await prisma.order.findFirst({
      where: {
        stripeSubscriptionId: subscriptionId,
        type: 'RECURRING_DONATION'
      }
    })

    if (!order) {
      return { success: false, data: null, error: `No order found for subscription ${subscriptionId}` }
    }

    // Cancel immediately in Stripe
    const cancelledSubscription = await stripe.subscriptions.cancel(subscriptionId, {
      cancellation_details: cancellationReason
        ? {
            comment: cancellationComment,
            feedback: cancellationReason as any
          }
        : undefined
    })

    // Update order in database
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
        isRecurring: false,
        nextBillingDate: null,
        updatedAt: new Date()
      }
    })

    await createLog('info', `Subscription cancelled: ${subscriptionId}`, {
      subscriptionId,
      orderId: order.id,
      userId: order.userId,
      cancellationReason,
      cancellationComment,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      amount: order.totalAmount,
      frequency: order.recurringFrequency
    })

    return {
      success: true,
      subscriptionId: cancelledSubscription.id,
      status: cancelledSubscription.status,
      canceledAt: cancelledSubscription.canceled_at
        ? new Date(cancelledSubscription.canceled_at * 1000).toISOString()
        : null,
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        isRecurring: updatedOrder.isRecurring,
        nextBillingDate: updatedOrder.nextBillingDate?.toISOString() || null,
        updatedAt: updatedOrder.updatedAt.toISOString()
      }
    }
  } catch (error) {
    await createLog('error', `Failed to cancel subscription: ${subscriptionId}`, {
      subscriptionId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return { success: false, data: null, error: `Failed to cancel subscription` }
  }
}
