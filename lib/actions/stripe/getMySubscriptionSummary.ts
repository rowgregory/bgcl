'use server'

import Stripe from 'stripe'
import prisma from '@/prisma/client'
import { stripe } from '../../stripe/stripeClient'
import { requireUser } from '@/lib/utils/requireAdmin'
import { createLog } from '../log/createLog'

export async function getMySubscriptionSummary(subscriptionId: string) {
  const auth = await requireUser()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  // Confirm it's theirs before asking Stripe about it
  const order = await prisma.order.findFirst({
    where: {
      stripeSubscriptionId: subscriptionId,
      type: 'RECURRING_DONATION',
      OR: [{ userId: auth.user.id }, { customerEmail: auth.user.email }]
    },
    select: { id: true }
  })

  if (!order) return { success: false, data: null, error: 'Subscription not found' }

  try {
    const sub = (await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['latest_invoice', 'default_payment_method']
    })) as any

    const item = sub.items.data[0]
    const card = sub.default_payment_method?.card ?? null

    const invoices = await stripe.invoices.list({ subscription: subscriptionId, limit: 100 })

    return {
      success: true,
      error: null,
      data: {
        status: sub.status,
        isCancelled: sub.status === 'canceled',
        willCancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
        isPastDue: sub.status === 'past_due' || sub.status === 'unpaid',
        currentPeriodEnd: item?.current_period_end ? new Date(item.current_period_end * 1000).toISOString() : null,
        startedAt: sub.created ? new Date(sub.created * 1000).toISOString() : null,
        amount: item?.price?.unit_amount != null ? item.price.unit_amount / 100 : null,
        interval: item?.price?.recurring?.interval ?? null,
        card: card ? { brand: card.brand, last4: card.last4 } : null,
        // Keyed by invoice id so the row can match them to its cycles
        invoices: invoices.data.map((inv) => ({
          id: inv.id,
          number: inv.number,
          amountPaid: (inv.amount_paid ?? 0) / 100,
          status: inv.status,
          created: new Date(inv.created * 1000).toISOString(),
          pdfUrl: inv.invoice_pdf,
          hostedUrl: inv.hosted_invoice_url
        }))
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch subscription summary', {
      userId: auth.user.id,
      subscriptionId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    if (error instanceof Stripe.errors.StripeAuthenticationError) {
      return { success: false, data: null, error: 'Payment provider is not configured correctly.' }
    }

    return { success: false, data: null, error: 'Could not load subscription details' }
  }
}
