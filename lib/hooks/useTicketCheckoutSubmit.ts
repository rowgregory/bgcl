'use client'

import { useElements, useStripe } from '@stripe/react-stripe-js'
import { useSession } from 'next-auth/react'
import { createPaymentIntentForTicketCheckout } from '../actions/stripe/createPaymentIntentForTicketCheckout'
import { useCartStore } from '@/stores/useCartStore'
import { usePaymentProcessor } from './usePaymentProcessor'
import { usePaymentStatus } from './usePaymentStatus'
import { cardPaymentMethod, getCardElement } from './paymentCard'
import { TicketCheckoutFormInput, TicketCheckoutFormValues } from '../validations/ticket-checkout.validation'

type Args = {
  /** The tickets themselves, in cents. The server adds the fee when covered. */
  baseAmount: number
  usingSavedCard: boolean
  fullName: string
}

/**
 * One payment intent carries one eventId, so a mixed cart would mislabel the
 * order. Returns the event the whole cart belongs to, or why it doesn't.
 */
function resolveCartEvent(items: { eventId: string }[]) {
  const eventId = items[0]?.eventId

  if (items.length === 0 || !eventId) {
    return { eventId: null, error: 'Your cart is empty.' }
  }

  if (items.some((item) => item.eventId !== eventId)) {
    return { eventId: null, error: 'Your cart has tickets for more than one event. Please check out one event at a time.' }
  }

  return { eventId, error: null }
}

/** Stripe metadata caps at 500 chars, so the keys are shortened here */
function serializeTickets(items: { ticketId: string; quantity: number }[]) {
  return JSON.stringify(items.map((item) => ({ i: item.ticketId, q: item.quantity })))
}

export function useTicketCheckoutSubmit({ baseAmount, usingSavedCard, fullName }: Args) {
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()
  const items = useCartStore((s) => s.items)

  const processor = usePaymentProcessor()
  const { isProcessing, start, fail, pusherCallbacks } = usePaymentStatus<TicketCheckoutFormInput>()

  const userEmail = session?.user?.email

  const submitCheckout = async (values: TicketCheckoutFormValues) => {
    if (!stripe || !elements) {
      fail('Payments are still loading. Try again in a moment.')
      return
    }

    if (!userEmail) {
      fail('Your session expired. Please sign in and try again.')
      return
    }

    const cart = resolveCartEvent(items)

    if (!cart.eventId) {
      fail(cart.error)
      return
    }

    start()

    try {
      const intentResult = await createPaymentIntentForTicketCheckout({
        name: fullName,
        email: userEmail,
        amount: baseAmount,
        description: `Order for ${fullName}`,
        saveCard: values.saveCard,
        coverFees: values.coverFees,
        address: {
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          city: values.city,
          state: values.state,
          zipPostalCode: values.zipPostalCode
        },
        savedCardId: usingSavedCard ? values.selectedCardId : undefined,
        tickets: serializeTickets(items),
        eventId: cart.eventId,
        attendingEvent: values.attendingEvent
      })

      if (!intentResult.success || !intentResult.data) {
        fail(intentResult.error || 'Failed to start checkout. Please try again.')
        return
      }

      // A saved card is confirmed server-side, so there is nothing to do here
      // but wait for the webhook to report back over Pusher
      if (usingSavedCard) {
        processor.setupPusherListenerOneTime(false, undefined, ...pusherCallbacks)
        return
      }

      const { clientSecret } = intentResult.data

      if (!clientSecret) {
        fail('Could not start the payment. Please try again.')
        return
      }

      const cardElement = getCardElement({ elements, fail })
      if (!cardElement) return

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: cardPaymentMethod({ fullName, userEmail }, cardElement)
      })

      if (error) {
        fail(error.message || 'Payment failed. Please try a different card.')
        return
      }

      if (paymentIntent?.status !== 'succeeded') {
        fail('This payment needs another step to complete. Please try again or use a different card.')
        return
      }

      processor.setupPusherListenerOneTime(
        values.saveCard,
        processor.getPaymentMethodId(paymentIntent.payment_method),
        ...pusherCallbacks
      )
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return { submitCheckout, isProcessing }
}
