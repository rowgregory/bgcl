'use client'

import { CardElement } from '@stripe/react-stripe-js'
import type { StripeCardElement, StripeElements } from '@stripe/stripe-js'

/** Returns null and reports the failure, so callers can just bail on null */
export function getCardElement({ elements, fail }: { elements: StripeElements; fail: (message: string) => void }) {
  const cardElement = elements.getElement(CardElement)

  if (!cardElement) {
    fail('Card details are unavailable. Please refresh and try again.')
    return null
  }

  return cardElement
}

export function cardPaymentMethod({ fullName, userEmail }: { fullName: string; userEmail: string }, card: StripeCardElement) {
  return { card, billing_details: { name: fullName, email: userEmail } }
}
