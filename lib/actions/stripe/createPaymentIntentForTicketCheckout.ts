'use server'

import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { stripe } from '../../stripe/stripeClient'
import { createLog } from '../log/createLog'
import { auth } from '@/lib/auth/auth'

interface TicketCheckoutParams {
  email: string
  name: string
  amount: number
  description: string
  saveCard?: boolean
  coverFees?: boolean
  feesCovered?: number
  address?: {
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zipPostalCode?: string
    country?: string
  }
  savedCardId?: string
  tickets: string
  eventId: string
  attendingEvent?: boolean
}

interface CartLine {
  ticketId: string
  quantity: number
}

const MIN_AMOUNT_CENTS = 500
const MAX_METADATA_LENGTH = 450

const trim = (value?: string | null) => (value ?? '').slice(0, MAX_METADATA_LENGTH)

const parseTickets = (tickets: string): CartLine[] => {
  try {
    const parsed = JSON.parse(tickets)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((line) => ({
        ticketId: String(line?.i ?? line?.ticketId ?? line?.id ?? ''),
        quantity: Number(line?.q ?? line?.quantity ?? 0)
      }))
      .filter((line) => line.ticketId && Number.isInteger(line.quantity) && line.quantity > 0)
  } catch {
    return []
  }
}

export async function createPaymentIntentForTicketCheckout({
  email,
  name,
  amount,
  description,
  saveCard = false,
  coverFees = false,
  feesCovered = 0,
  address,
  savedCardId,
  tickets,
  eventId,
  attendingEvent
}: TicketCheckoutParams): Promise<{
  success: boolean
  data: { clientSecret: string | null; paymentIntentId: string } | null
  error: string | null
}> {
  // The user comes from the session, never from the caller
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return { success: false, data: null, error: 'You must be signed in to purchase tickets.' }

  const lines = parseTickets(tickets)

  if (lines.length === 0) {
    return { success: false, data: null, error: 'Your cart is empty.' }
  }

  try {
    // Price and availability come from the database, never from the cart
    const ticketRows = await prisma.ticket.findMany({
      where: { id: { in: lines.map((l) => l.ticketId) }, eventId },
      select: { id: true, name: true, price: true, totalQuantity: true, quantitySold: true }
    })

    if (ticketRows.length !== lines.length) {
      return { success: false, data: null, error: 'One or more tickets are no longer available.' }
    }

    let subtotal = 0

    for (const line of lines) {
      const ticket = ticketRows.find((t) => t.id === line.ticketId)!
      const remaining = ticket.totalQuantity - ticket.quantitySold

      if (line.quantity > remaining) {
        return {
          success: false,
          data: null,
          error: `Only ${remaining} left for ${ticket.name}. Please update your cart.`
        }
      }

      subtotal += Math.round(Number(ticket.price) * 100) * line.quantity
    }

    const fees = coverFees ? Math.max(0, Math.round(feesCovered)) : 0
    const expectedAmount = subtotal + fees

    if (expectedAmount < MIN_AMOUNT_CENTS) {
      return { success: false, data: null, error: 'Minimum purchase amount is $5.' }
    }

    // The client's total is only a cross-check; the server's figure is charged
    if (amount !== expectedAmount) {
      await createLog('warn', 'Ticket checkout amount mismatch', {
        userId,
        eventId,
        clientAmount: amount,
        expectedAmount
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })

    const customerId = user?.stripeCustomerId ?? undefined

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: expectedAmount,
      currency: 'usd',
      customer: customerId,
      receipt_email: email,
      description,
      setup_future_usage: saveCard && customerId ? 'on_session' : undefined,
      metadata: {
        userId,
        orderType: 'TICKET_PURCHASE',
        name: trim(name),
        email: trim(email),
        saveCard: saveCard ? 'true' : 'false',
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: String(fees),
        addressLine1: trim(address?.addressLine1),
        addressLine2: trim(address?.addressLine2),
        city: trim(address?.city),
        state: trim(address?.state),
        zipPostalCode: trim(address?.zipPostalCode),
        country: trim(address?.country) || 'US',
        tickets: trim(tickets),
        eventId,
        attendingEvent: attendingEvent ? 'true' : 'false'
      }
    }

    if (savedCardId) {
      const savedCard = await prisma.paymentMethod.findUnique({
        where: { stripePaymentId: savedCardId },
        select: { stripePaymentId: true, userId: true }
      })

      if (!savedCard || savedCard.userId !== userId) {
        await createLog('warn', 'Saved card ownership mismatch on ticket checkout', { userId, savedCardId })
        return { success: false, data: null, error: 'That saved card is not available.' }
      }

      const paymentMethod = await stripe.paymentMethods.retrieve(savedCard.stripePaymentId)

      if (!customerId || paymentMethod.customer !== customerId) {
        await createLog('warn', 'Saved card customer mismatch on ticket checkout', { userId, savedCardId })
        return { success: false, data: null, error: 'That saved card is not available.' }
      }

      paymentIntentParams.payment_method = savedCard.stripePaymentId
      paymentIntentParams.off_session = true
      paymentIntentParams.confirm = true
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams)

    return {
      success: true,
      error: null,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    }
  } catch (error) {
    await createLog('error', 'Ticket payment intent creation error', {
      userId,
      eventId,
      name,
      email,
      savedCardId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    if (error instanceof Stripe.errors.StripeCardError) {
      return { success: false, data: null, error: error.message }
    }

    return { success: false, data: null, error: 'Could not start the payment. Please try again.' }
  }
}
