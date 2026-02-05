import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { createLog } from '@/app/lib/actions/createLog'
import { stripe } from '@/app/lib/stripe/stripeClient'
import { pusher } from '@/app/lib/pusher'
import sendConfirmationEmail from '@/app/lib/utils/sendConfirmationEmail'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    await createLog('error', 'Webhook signature verification failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type as string) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Skip if this is part of a subscription
        if ((paymentIntent as any).invoice) {
          break
        }

        await handlePaymentIntentSucceeded(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod)
        break

      case 'payment_method.detached':
        await handlePaymentMethodDetached(event.data.object as Stripe.PaymentMethod)
        break

      case 'payment_method.updated':
        await handlePaymentMethodUpdated(event.data.object as Stripe.PaymentMethod)
        break

      case 'customer.subscription.created':
        const newSub = event.data.object as Stripe.Subscription

        // Fetch the full subscription
        const fullSub = await stripe.subscriptions.retrieve(newSub.id)

        if (fullSub.status === 'incomplete') {
          break
        }
        if (fullSub.status === 'active') {
          await handleSubscriptionCreated(fullSub)
        }
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        const updatedSub = event.data.object as Stripe.Subscription

        // Handle status changes that affect the order
        const statusesToHandle = ['active', 'past_due', 'canceled', 'unpaid', 'incomplete']

        if (statusesToHandle.includes(updatedSub.status)) {
          await handleSubscriptionUpdated(updatedSub)
        }
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      default:
        await createLog('info', 'Unhandled webhook event', {
          eventType: event.type,
          eventId: event.id
        })
        break
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    await createLog('error', 'Webhook handler failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { id, amount, metadata } = paymentIntent

  try {
    // Skip if this is a subscription payment
    if (paymentIntent.setup_future_usage === 'off_session' || paymentIntent.description === 'Subscription creation') {
      return
    }

    // Skip if associated with invoice
    if ((paymentIntent as any).invoice) {
      return
    }

    const existingOrder = await prisma.order.findFirst({
      where: { paymentIntentId: id }
    })

    if (existingOrder) {
      return
    }

    const orderType =
      (metadata?.orderType as 'ONE_TIME_DONATION' | 'RECURRING_DONATION' | 'TICKET_PURCHASE') || 'ONE_TIME_DONATION'
    const userId = metadata?.userId && metadata.userId !== 'guest' ? metadata.userId : null

    const order = await prisma.order.create({
      data: {
        type: orderType,
        status: 'CONFIRMED',
        totalAmount: amount / 100,
        paymentMethod: 'stripe',
        paymentIntentId: id,
        customerEmail: (metadata?.email as string) || '',
        customerName: (metadata?.name as string) || 'Guest',
        userId,
        paidAt: new Date(),
        billingAddress: {
          address: metadata.address,
          city: metadata.city,
          state: metadata.state,
          zipCode: metadata.zipCode,
          country: metadata.country
        },
        notes: metadata.notes || null,
        coverFees: metadata.coverFees === 'true',
        feesCovered: parseInt(metadata.feesCovered) || 0,
        isRecurring: metadata.donationType === 'monthly' || metadata.donationType === 'yearly',
        recurringFrequency:
          metadata.donationType === 'monthly' ? 'monthly' : metadata.donationType === 'yearly' ? 'yearly' : null,
        campaignId: metadata.campaignId || null,
        paymentMethodId: (paymentIntent.payment_method as string) || null
      }
    })

    // Create order items for ticket purchases
    if (orderType === 'TICKET_PURCHASE' && metadata?.ticketIds) {
      const ticketIds = JSON.parse(metadata.ticketIds as string)
      const pricePerTicket = amount / 100 / ticketIds.length

      for (const ticketId of ticketIds) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            ticketId,
            quantity: 1,
            pricePerUnit: pricePerTicket,
            totalPrice: pricePerTicket,
            ticketName: metadata.ticketName || 'Ticket'
          }
        })
      }
    }

    // Send confirmation email
    await sendConfirmationEmail(order, orderType, amount, metadata)

    // Push to Pusher
    const channelId = userId || `guest-${paymentIntent.id}`
    await pusher.trigger(`payment-${channelId}`, 'order-created', {
      orderId: order.id,
      amount: order.totalAmount,
      status: order.status,
      type: order.type,
      createdAt: order.createdAt
    })

    await createLog('info', 'Order created from payment intent', {
      orderId: order.id,
      userId,
      type: orderType,
      paymentIntentId: id,
      amount: amount / 100
    })
  } catch (error) {
    await createLog('error', 'Failed to create order from payment intent', {
      error: error instanceof Error ? error.message : 'Unknown error',
      amount: amount / 100,
      paymentIntentId: id
    })
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { id, last_payment_error, metadata } = paymentIntent

  try {
    const orderType =
      (metadata?.orderType as 'ONE_TIME_DONATION' | 'RECURRING_DONATION' | 'TICKET_PURCHASE') || 'ONE_TIME_DONATION'
    const userId = metadata?.userId && metadata.userId !== 'guest' ? metadata.userId : null

    const order = await prisma.order.create({
      data: {
        type: orderType,
        status: 'FAILED',
        totalAmount: paymentIntent.amount / 100,
        paymentMethod: 'stripe',
        paymentIntentId: id,
        customerEmail: (metadata?.email as string) || '',
        customerName: (metadata?.name as string) || 'Guest',
        userId,
        failureReason: last_payment_error?.message || 'Payment failed',
        failureCode: last_payment_error?.code || null
      }
    })

    // Push to same channel as successful orders
    const channelId = userId || `guest-${paymentIntent.id}`
    await pusher.trigger(`payment-${channelId}`, 'order-failed', {
      orderId: order.id,
      error: last_payment_error?.message || 'Payment failed',
      type: orderType
    })

    await createLog('error', 'Payment failed from Stripe webhook', {
      orderId: order.id,
      userId,
      type: orderType,
      paymentIntentId: id,
      failureReason: last_payment_error?.message,
      failureCode: last_payment_error?.code
    })
  } catch (error) {
    await createLog('error', 'Error handling payment failure', {
      error: error instanceof Error ? error.message : 'Unknown error',
      paymentIntentId: id
    })
  }
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  try {
    const customerId = typeof paymentMethod.customer === 'string' ? paymentMethod.customer : paymentMethod.customer?.id

    if (!customerId) {
      return
    }

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId }
    })

    if (!user) {
      return
    }

    const existing = await prisma.paymentMethod.findUnique({
      where: { stripePaymentId: paymentMethod.id }
    })

    if (existing) {
      return
    }

    await prisma.paymentMethod.create({
      data: {
        stripePaymentId: paymentMethod.id,
        cardholderName: paymentMethod.billing_details?.name || 'Unknown',
        cardBrand: paymentMethod.card?.brand || 'unknown',
        cardLast4: paymentMethod.card?.last4 || '0000',
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0,
        isDefault: false,
        userId: user.id
      }
    })

    await createLog('info', 'Payment method attached via webhook', {
      paymentMethodId: paymentMethod.id,
      userId: user.id
    })
  } catch (error) {
    await createLog('error', 'Error handling payment method attached', {
      error: error instanceof Error ? error.message : 'Unknown error',
      paymentMethodId: paymentMethod.id
    })
  }
}

async function handlePaymentMethodDetached(paymentMethod: Stripe.PaymentMethod) {
  try {
    await prisma.paymentMethod.deleteMany({
      where: { stripePaymentId: paymentMethod.id }
    })

    await createLog('info', 'Payment method detached', {
      paymentMethodId: paymentMethod.id
    })
  } catch (error) {
    await createLog('error', 'Error handling payment method detach', {
      paymentMethodId: paymentMethod.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handlePaymentMethodUpdated(paymentMethod: Stripe.PaymentMethod) {
  try {
    if (!paymentMethod.customer) return

    await prisma.paymentMethod.update({
      where: { stripePaymentId: paymentMethod.id },
      data: {
        cardBrand: paymentMethod.card?.brand || 'unknown',
        cardLast4: paymentMethod.card?.last4 || '0000',
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0
      }
    })

    await createLog('info', 'Payment method updated', {
      paymentMethodId: paymentMethod.id,
      customerId: typeof paymentMethod.customer === 'string' ? paymentMethod.customer : paymentMethod.customer?.id
    })
  } catch (error) {
    await createLog('error', 'Error updating payment method', {
      paymentMethodId: paymentMethod.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    await createLog('info', 'Stripe subscription created', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
      frequency: subscription.metadata?.frequency || 'monthly',
      amount: subscription.items.data[0]?.price.unit_amount || 0,
      customerEmail: subscription.metadata?.email,
      campaignId: subscription.metadata?.campaignId,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      createdAt: new Date(subscription.created * 1000)
    })
  } catch (error) {
    console.error('Error handling subscription created:', error)
    await createLog('error', 'Failed to log subscription creation', {
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const order = await prisma.order.update({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: 'CANCELLED' }
    })

    await createLog('info', 'Recurring donation cancelled', {
      subscriptionId: subscription.id,
      orderId: order.id,
      userId: order.userId
    })

    if (order?.userId) {
      await pusher.trigger(`user-${order.userId}`, 'subscription-cancelled', {
        subscriptionId: subscription.id
      })
    }
  } catch (error) {
    await createLog('error', 'Error cancelling recurring donation', {
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const statusMap: Record<string, 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'FAILED'> = {
      active: 'CONFIRMED',
      past_due: 'PENDING',
      canceled: 'CANCELLED',
      unpaid: 'FAILED',
      incomplete: 'PENDING'
    }

    const order = await prisma.order.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: statusMap[subscription.status] || 'PENDING',
        nextBillingDate: (subscription as any).current_period_end
          ? new Date((subscription as any).current_period_end * 1000)
          : null
      }
    })

    await createLog('info', 'Subscription updated', {
      subscriptionId: subscription.id,
      orderId: order.id,
      status: subscription.status
    })

    if (order?.userId) {
      await pusher.trigger(`user-${order.userId}`, 'subscription-updated', {
        subscriptionId: subscription.id,
        status: subscription.status,
        nextBillingDate: order.nextBillingDate
      })
    }
  } catch (error) {
    await createLog('error', 'Error updating subscription', {
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const invoiceWithSub = invoice as any

    // Check for subscription in multiple locations (Stripe API changes)
    let subscriptionId: string | null = null

    if (invoiceWithSub.subscription) {
      subscriptionId =
        typeof invoiceWithSub.subscription === 'string' ? invoiceWithSub.subscription : invoiceWithSub.subscription.id
    } else if (invoiceWithSub.parent?.subscription_details?.subscription) {
      subscriptionId = invoiceWithSub.parent.subscription_details.subscription
    }

    if (!subscriptionId) {
      return
    }

    const isFirstPayment = invoice.billing_reason === 'subscription_create'

    const paymentIntentId = invoiceWithSub.payment_intent
      ? typeof invoiceWithSub.payment_intent === 'string'
        ? invoiceWithSub.payment_intent
        : invoiceWithSub.payment_intent?.id
      : null

    // Check if order already exists
    const existingOrder = await prisma.order.findFirst({
      where: {
        stripeSubscriptionId: subscriptionId,
        ...(paymentIntentId && { paymentIntentId })
      }
    })

    if (existingOrder) {
      return
    }

    // Get the subscription details
    const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method']
    })

    const subscription = subscriptionResponse as Stripe.Subscription

    const userId = subscription.metadata?.userId
    const frequency = subscription.metadata?.frequency || 'monthly'
    const amount = invoice.amount_paid / 100
    const coverFees = subscription.metadata?.coverFees === 'true'
    const feesCovered = parseInt(subscription.metadata?.feesCovered || '0')

    const order = await prisma.order.create({
      data: {
        type: 'RECURRING_DONATION',
        status: 'CONFIRMED',
        totalAmount: amount,
        paymentMethod: 'stripe',
        customerEmail: subscription.metadata?.email || invoice.customer_email || '',
        customerName: subscription.metadata?.name || '',
        userId: userId && userId !== 'guest' ? userId : null,
        stripeSubscriptionId: subscriptionId,
        paymentIntentId: paymentIntentId || null,
        paymentMethodId:
          typeof subscription.default_payment_method === 'string'
            ? subscription.default_payment_method
            : subscription.default_payment_method?.id || null,
        isRecurring: true,
        recurringFrequency: frequency,
        coverFees: coverFees,
        feesCovered: feesCovered,
        paidAt: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
        nextBillingDate: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
        billingAddress: {
          address: subscription.metadata?.address || '',
          city: subscription.metadata?.city || '',
          state: subscription.metadata?.state || '',
          zipCode: subscription.metadata?.zipCode || '',
          country: subscription.metadata?.country || ''
        },
        notes: subscription.metadata?.notes || null,
        campaignId: subscription.metadata?.campaignId || null
      }
    })

    await createLog('info', `Recurring donation ${isFirstPayment ? 'created' : 'renewed'}`, {
      orderId: order.id,
      subscriptionId,
      amount,
      isFirstPayment
    })

    // Only send confirmation email on first payment
    if (isFirstPayment) {
      await sendConfirmationEmail(order, 'RECURRING_DONATION', amount * 100, subscription.metadata)
    }

    const channelId = `payment-${subscriptionId}`
    await pusher.trigger(channelId, 'order-created', {
      orderId: order.id,
      amount: order.totalAmount,
      status: order.status,
      type: order.type,
      frequency,
      coverFees,
      feesCovered,
      createdAt: order.createdAt
    })
  } catch (error) {
    await createLog('error', 'Error handling invoice payment', {
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
