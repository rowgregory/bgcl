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
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type as string) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Skip if this is part of a subscription
        if ((paymentIntent as any).invoice) {
          console.log('Skipping payment intent from subscription invoice')
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
        console.log('Full subscription:', JSON.stringify(fullSub, null, 2))

        if (fullSub.status === 'incomplete') {
          console.log('Subscription incomplete, waiting for payment:', fullSub.id)
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
        let updatedSub = event.data.object as Stripe.Subscription
        updatedSub = await stripe.subscriptions.retrieve(updatedSub.id)

        // Only handle status changes (pause, cancel, etc) - NOT creation
        if (updatedSub.status === 'past_due' || updatedSub.status === 'canceled') {
          await handleSubscriptionUpdated(updatedSub)
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { id, amount, metadata } = paymentIntent

  try {
    const existingOrder = await prisma.order.findFirst({
      where: { paymentIntentId: id }
    })

    if (existingOrder) {
      console.log('Order already exists for this payment intent')
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
        paymentMethodId: (paymentIntent.payment_method as string) || null // Get it directly from Stripe
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

    console.log('Order created from webhook:', order.id)

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

    // Log to database
    await createLog('info', 'Order created from Stripe webhook', {
      orderId: order.id,
      userId,
      type: orderType,
      paymentIntentId: id,
      amount
    })
  } catch (error) {
    await createLog('error', 'Failed to create order from Stripe webhook', {
      error: error instanceof Error ? error.message : 'Unknown error',
      amount,
      paymentIntentId: id
    })
    throw error
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
        userId
      }
    })

    console.error('Payment failed:', {
      paymentIntentId: id,
      orderId: order.id,
      error: last_payment_error?.message,
      userId
    })

    // Push to same channel as successful orders
    const channelId = userId || `guest-${paymentIntent.id}`
    await pusher.trigger(`payment-${channelId}`, 'order-failed', {
      orderId: order.id,
      error: last_payment_error?.message || 'Payment failed',
      type: orderType
    })

    // Log to database
    await createLog('error', 'Payment failed from Stripe webhook', {
      orderId: order.id,
      userId,
      type: orderType,
      paymentIntentId: id,
      error: last_payment_error?.message
    })
  } catch (error) {
    await createLog('error', 'Error handling payment failure', {
      error: error instanceof Error ? error.message : 'Unknown error',
      paymentIntentId: id
    })
    throw error
  }
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  // This is called when a new card is saved
  console.log('Payment method attached:', paymentMethod.id)
}

async function handlePaymentMethodDetached(paymentMethod: Stripe.PaymentMethod) {
  // This is called when a card is deleted
  try {
    await prisma.paymentMethod.deleteMany({
      where: { stripePaymentId: paymentMethod.id }
    })

    console.log('Payment method deleted from database:', paymentMethod.id)
  } catch (error) {
    console.error('Error handling payment method detach:', error)
  }
}

async function handlePaymentMethodUpdated(paymentMethod: Stripe.PaymentMethod) {
  try {
    if (!paymentMethod.customer) return

    // Update the payment method in database
    await prisma.paymentMethod.update({
      where: { stripePaymentId: paymentMethod.id },
      data: {
        cardBrand: paymentMethod.card?.brand || 'unknown',
        cardLast4: paymentMethod.card?.last4 || '0000',
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0
      }
    })

    console.log('Payment method updated:', paymentMethod.id)
  } catch (error) {
    console.error('Error handling payment method update:', error)
    throw error
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const existingOrder = await prisma.order.findFirst({
      where: { stripeSubscriptionId: subscription.id }
    })

    if (existingOrder) {
      console.log('Order already exists for subscription:', subscription.id)
      return
    }

    const userId = subscription.metadata?.userId
    const frequency = subscription.metadata?.frequency || 'monthly'
    const amount = (subscription.items.data[0]?.price.unit_amount || 0) / 100

    // Get current_period_end from subscription items
    const currentPeriodEnd = subscription.items.data[0]?.current_period_end

    if (!currentPeriodEnd) {
      throw new Error('Subscription item missing current_period_end')
    }

    const order = await prisma.order.create({
      data: {
        type: 'RECURRING_DONATION',
        status: 'CONFIRMED',
        totalAmount: amount,
        paymentMethod: 'stripe',
        customerEmail: subscription.metadata?.email || '',
        customerName: subscription.metadata?.name || '',
        userId: userId && userId !== 'guest' ? userId : null,
        stripeSubscriptionId: subscription.id,
        isRecurring: true,
        recurringFrequency: frequency,
        paidAt: new Date(),
        nextBillingDate: new Date(currentPeriodEnd * 1000)
      }
    })

    console.log('Recurring donation created:', subscription.id)

    await sendConfirmationEmail(order, 'RECURRING_DONATION', amount * 100, subscription.metadata)

    const channelId = userId && userId !== 'guest' ? userId : `guest-${subscription.id}`
    await pusher.trigger(`payment-${channelId}`, 'order-created', {
      orderId: order.id,
      amount: order.totalAmount,
      status: order.status,
      type: order.type,
      frequency,
      createdAt: order.createdAt
    })
  } catch (error) {
    console.error('Error creating recurring donation:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const order = await prisma.order.update({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: 'CANCELLED' }
    })

    console.log('Recurring donation cancelled:', subscription.id)

    if (order?.userId) {
      await pusher.trigger(`user-${order.userId}`, 'subscription-cancelled', {
        subscriptionId: subscription.id
      })
    }
  } catch (error) {
    console.error('Error cancelling recurring donation:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const order = await prisma.order.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status === 'active' ? 'CONFIRMED' : 'CANCELLED',
        nextBillingDate: new Date((subscription as any).current_period_end * 1000)
      }
    })

    console.log('Recurring donation updated:', subscription.id)

    if (order?.userId) {
      await pusher.trigger(`user-${order.userId}`, 'subscription-updated', {
        subscriptionId: subscription.id,
        status: subscription.status,
        nextBillingDate: new Date((subscription as any).current_period_end * 1000)
      })
    }
  } catch (error) {
    console.error('Error updating recurring donation:', error)
  }
}
