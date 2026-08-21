import prisma from '@/prisma/client'
import { stripe } from '../../stripe/stripeClient'
import { requireUser } from '@/lib/utils/requireAdmin'
import { createLog } from '../log/createLog'
import Stripe from 'stripe'

export async function getSubscriptionDetails(subscriptionId: string) {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const response = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer', 'latest_invoice', 'default_payment_method']
    })
    const subscription = response as any

    console.log('subscription: ', subscription)

    const order = await prisma.order.findFirst({
      where: {
        stripeSubscriptionId: subscriptionId,
        type: 'RECURRING_DONATION'
      }
    })

    // Get the billing interval from the subscription items
    const recurringInterval = subscription.items.data[0]?.price?.recurring?.interval || 'month'
    const recurringIntervalCount = subscription.items.data[0]?.price?.recurring?.interval_count || 1

    // Calculate next billing date
    const startTimestamp = subscription.start_date || subscription.created
    const startDate = new Date(startTimestamp * 1000)

    const nextBillingDate = new Date(startDate)
    if (recurringInterval === 'month') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + recurringIntervalCount)
    } else if (recurringInterval === 'year') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + recurringIntervalCount)
    } else if (recurringInterval === 'week') {
      nextBillingDate.setDate(nextBillingDate.getDate() + 7 * recurringIntervalCount)
    } else if (recurringInterval === 'day') {
      nextBillingDate.setDate(nextBillingDate.getDate() + recurringIntervalCount)
    }

    // Serialize all the data to plain objects
    return {
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end || false,
          canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : undefined,
          current_period_start: new Date(startTimestamp * 1000).toISOString(),
          current_period_end: nextBillingDate.toISOString(),

          created: subscription.created ? new Date(subscription.created * 1000).toISOString() : null,

          // Billing cycle
          billing_cycle_anchor: subscription.billing_cycle_anchor
            ? new Date(subscription.billing_cycle_anchor * 1000).toISOString()
            : null,
          days_until_due: subscription.days_until_due,

          // Collection method
          collection_method: subscription.collection_method,

          // Cancellation details
          cancellation_details: subscription.cancellation_details
            ? {
                comment: subscription.cancellation_details.comment,
                feedback: subscription.cancellation_details.feedback,
                reason: subscription.cancellation_details.reason
              }
            : null,

          // Amount and currency
          items: subscription.items.data.map((item: any) => ({
            id: item.id,
            price: {
              id: item.price.id,
              unit_amount: item.price.unit_amount,
              currency: item.price.currency,
              recurring: {
                interval: item.price.recurring?.interval,
                interval_count: item.price.recurring?.interval_count
              }
            },
            quantity: item.quantity
          })),

          // Payment method info (if expanded)
          default_payment_method: subscription.default_payment_method
            ? {
                id: subscription.default_payment_method.id,
                type: subscription.default_payment_method.type,
                card: subscription.default_payment_method.card
                  ? {
                      brand: subscription.default_payment_method.card.brand,
                      last4: subscription.default_payment_method.card.last4,
                      exp_month: subscription.default_payment_method.card.exp_month,
                      exp_year: subscription.default_payment_method.card.exp_year
                    }
                  : null
              }
            : null,

          // Latest invoice (if expanded)
          latest_invoice: subscription.latest_invoice
            ? {
                id: subscription.latest_invoice.id,
                amount_due: subscription.latest_invoice.amount_due,
                amount_paid: subscription.latest_invoice.amount_paid,
                status: subscription.latest_invoice.status,
                created: new Date(subscription.latest_invoice.created * 1000).toISOString(),
                hosted_invoice_url: subscription.latest_invoice.hosted_invoice_url,
                invoice_pdf: subscription.latest_invoice.invoice_pdf
              }
            : null,

          // Trial info
          trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
          trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,

          // Metadata
          metadata: subscription.metadata
        },

        order: order
          ? {
              id: order.id,
              type: order.type,
              status: order.status,
              totalAmount: Number(order.totalAmount),
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              customerPhone: order.customerPhone,
              recurringFrequency: order.recurringFrequency,
              paymentMethod: order.paymentMethod,
              isRecurring: order.isRecurring,
              stripeSubscriptionId: order.stripeSubscriptionId,
              paymentIntentId: order.paymentIntentId,
              nextBillingDate: order.nextBillingDate ? order.nextBillingDate.toISOString() : null,
              paidAt: order.paidAt ? order.paidAt.toISOString() : null,
              createdAt: order.createdAt.toISOString(),
              updatedAt: order.updatedAt.toISOString()
            }
          : null,

        // Computed values
        isCancelled: subscription.status === 'canceled',
        willCancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        currentPeriodEnd: subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null,
        isActive: subscription.status === 'active',
        isPastDue: subscription.status === 'past_due',
        isUnpaid: subscription.status === 'unpaid'
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch subscription details', {
      userId: auth.user.id,
      subscriptionId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    return { success: false, data: null, error: 'Could not load subscription details' }
  }
}
