'use client'

import { useCallback, useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useSession } from 'next-auth/react'
import { useFormContext } from 'react-hook-form'
import { createPaymentIntentForTicketCheckout } from '../actions/stripe/createPaymentIntentForTicketCheckout'
import { useCartStore } from '@/stores/useCartStore'
import { usePaymentProcessor } from './usePaymentProcessor'
import { TicketCheckoutFormInput, TicketCheckoutFormValues } from '../validations/ticket-checkout.validation'

type ProcessingStatus = 'idle' | 'processing' | 'success' | 'failed'

type Args = {
  amountInCents: number
  processingFee: number
  usingSavedCard: boolean
  fullName: string
}

export function useTicketCheckoutSubmit({ amountInCents, processingFee, usingSavedCard, fullName }: Args) {
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()
  const items = useCartStore((s) => s.items)

  const { setError } = useFormContext<TicketCheckoutFormInput>()
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle')
  const isProcessing = processingStatus === 'processing'

  const userEmail = session?.user?.email

  const fail = useCallback(
    (message: string) => {
      setError('root', { message })
      setProcessingStatus('failed')
    },
    [setError]
  )

  // The listener still takes callbacks: error, status, and a loading reset
  const pusherCallbacks = [
    (value: string) => setError('root', { message: value }),
    (value: string) => setProcessingStatus(value as ProcessingStatus),
    () => setProcessingStatus((current) => (current === 'processing' ? 'idle' : current))
  ] as const

  const submitCheckout = async (values: TicketCheckoutFormValues) => {
    if (!stripe || !elements) {
      fail('Payments are still loading. Try again in a moment.')
      return
    }

    if (!userEmail) {
      fail('Your session expired. Please sign in and try again.')
      return
    }

    const eventId = items[0]?.eventId

    if (items.length === 0 || !eventId) {
      fail('Your cart is empty.')
      return
    }

    // One payment intent carries one eventId, so a mixed cart would mislabel the order
    if (items.some((item) => item.eventId !== eventId)) {
      fail('Your cart has tickets for more than one event. Please check out one event at a time.')
      return
    }

    setProcessingStatus('processing')

    try {
      const intentResult = await createPaymentIntentForTicketCheckout({
        name: fullName,
        email: userEmail,
        amount: amountInCents,
        description: `Order for ${fullName}`,
        saveCard: values.saveCard,
        coverFees: values.coverFees,
        feesCovered: values.coverFees ? processingFee : 0,
        address: {
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          city: values.city,
          state: values.state,
          zipPostalCode: values.zipPostalCode
        },
        savedCardId: usingSavedCard ? values.selectedCardId : undefined,
        // Stripe metadata caps at 500 chars, so keys are shortened here
        tickets: JSON.stringify(items.map((item) => ({ i: item.ticketId, q: item.quantity }))),
        eventId,
        attendingEvent: values.attendingEvent
      })

      if (!intentResult.success || !intentResult.data) {
        fail(intentResult.error || 'Failed to start checkout. Please try again.')
        return
      }

      if (usingSavedCard) {
        setupPusherListenerOneTime(false, undefined, ...pusherCallbacks)
        return
      }

      const { clientSecret } = intentResult.data

      if (!clientSecret) {
        fail('Could not start the payment. Please try again.')
        return
      }

      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        fail('Card details are unavailable. Please refresh and try again.')
        return
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement, billing_details: { name: fullName, email: userEmail } }
      })

      if (error) {
        fail(error.message || 'Payment failed. Please try a different card.')
        return
      }

      if (paymentIntent?.status !== 'succeeded') {
        fail('This payment needs another step to complete. Please try again or use a different card.')
        return
      }

      setupPusherListenerOneTime(values.saveCard, getPaymentMethodId(paymentIntent.payment_method), ...pusherCallbacks)
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return { submitCheckout, isProcessing }
}
