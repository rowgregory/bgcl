'use client'

import type { Stripe, StripeElements } from '@stripe/stripe-js'
import type { DonationFormValues } from '@/lib/validations/donation.validation'
import type { usePaymentProcessor } from '../usePaymentProcessor'
import type { PusherCallbacks } from '../usePaymentStatus'

export type DonorAddress = Record<string, string | null | undefined>

/** Everything the handlers need, assembled once per submit */
export type SubmitContext = {
  stripe: Stripe
  elements: StripeElements
  userEmail: string
  values: DonationFormValues
  baseAmount: number
  usingSavedCard: boolean
  fullName: string
  address: DonorAddress
  processor: ReturnType<typeof usePaymentProcessor>
  pusherCallbacks: PusherCallbacks
  fail: (message: string) => void
}

export function donationFrequency({ values }: SubmitContext): 'monthly' | 'yearly' {
  return values.donationType === 'monthly' ? 'monthly' : 'yearly'
}
