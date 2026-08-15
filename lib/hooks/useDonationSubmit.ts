'use client'

import { useCallback, useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { Stripe, StripeElements } from '@stripe/stripe-js'
import { useSession } from 'next-auth/react'
import { useFormContext } from 'react-hook-form'

import { createPaymentIntentForCheckout } from '../actions/stripe/createPaymentIntentForCheckout'
import { createSetupIntentForSubscription } from '../actions/stripe/createSetupIntentForSubscription'
import { createSubscriptionAfterSetup } from '../actions/stripe/createSubscriptionAfterSetup'
import { createSubscriptionWithSavedCard } from '../actions/stripe/createSubscriptionWithSavedCard'
import type { DonationFormInput, DonationFormValues } from '@/lib/validations/donation.validation'
import { usePaymentProcessor } from './usePaymentProcessor'

type ProcessingStatus = 'idle' | 'processing' | 'success' | 'failed'

type Args = {
  finalAmount: number
  feesCovered: number
  usingSavedCard: boolean
  fullName: string
}

type PusherCallbacks = readonly [(value: string) => void, (value: string) => void, () => void]

export function useDonationSubmit({ finalAmount, feesCovered, usingSavedCard, fullName }: Args) {
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()

  const { setError } = useFormContext<DonationFormInput>()
  const { setupPusherListenerOneTime, getPaymentMethodId, setupPusherListenerRecurring } = usePaymentProcessor()

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle')
  const isProcessing = processingStatus === 'processing'

  const userId = session?.user?.id
  const userEmail = session?.user?.email

  const fail = useCallback(
    (message: string) => {
      setError('root', { message })
      setProcessingStatus('failed')
    },
    [setError]
  )

  const pusherCallbacks: PusherCallbacks = [
    (value: string) => setError('root', { message: value }),
    (value: string) => setProcessingStatus(value as ProcessingStatus),
    () => setProcessingStatus((current) => (current === 'processing' ? 'idle' : current))
  ]

  const submitDonation = async (values: DonationFormValues) => {
    if (!stripe || !elements) {
      fail('Payments are still loading. Try again in a moment.')
      return
    }

    if (!userEmail) {
      fail('Your session expired. Please sign in and try again.')
      return
    }

    setProcessingStatus('processing')

    const shared = {
      stripe,
      elements,
      userId,
      userEmail,
      values,
      finalAmount,
      feesCovered,
      usingSavedCard,
      fullName,
      addressParams: {
        address: {
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          city: values.city,
          state: values.state,
          zipPostalCode: values.zipPostalCode
        }
      },
      pusherCallbacks,
      fail
    }

    try {
      if (values.donationType === 'once') {
        await handleOneTimeDonation({ ...shared, setupPusherListenerOneTime, getPaymentMethodId })
      } else {
        await handleRecurringDonation({ ...shared, setupPusherListenerRecurring })
      }
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return { submitDonation, isProcessing }
}

type SharedArgs = {
  stripe: Stripe
  elements: StripeElements
  userId?: string
  userEmail: string
  values: DonationFormValues
  finalAmount: number
  feesCovered: number
  usingSavedCard: boolean
  fullName: string
  addressParams: { address: Record<string, string | null | undefined> }
  pusherCallbacks: PusherCallbacks
  fail: (message: string) => void
}

async function handleOneTimeDonation({
  stripe,
  elements,
  userId,
  userEmail,
  values,
  finalAmount,
  feesCovered,
  usingSavedCard,
  fullName,
  addressParams,
  pusherCallbacks,
  fail,
  setupPusherListenerOneTime,
  getPaymentMethodId
}: SharedArgs & {
  setupPusherListenerOneTime: ReturnType<typeof usePaymentProcessor>['setupPusherListenerOneTime']
  getPaymentMethodId: ReturnType<typeof usePaymentProcessor>['getPaymentMethodId']
}) {
  const intentResult = await createPaymentIntentForCheckout({
    userId,
    name: fullName,
    email: userEmail,
    amount: finalAmount,
    orderType: 'ONE_TIME_DONATION',
    description: `One-time donation from ${fullName}`,
    saveCard: values.saveCard,
    coverFees: values.coverFees,
    feesCovered,
    ...addressParams,
    savedCardId: usingSavedCard ? values.selectedCardId : undefined,
    campaignId: values.campaignId,
    notes: values.notes,
    phone: values.phone
  })

  if (!intentResult.success) {
    fail(intentResult.error || 'Failed to start the donation. Please try again.')
    return
  }

  if (usingSavedCard) {
    setupPusherListenerOneTime(false, undefined, ...pusherCallbacks)
    return
  }

  const cardElement = elements.getElement(CardElement)

  if (!cardElement) {
    fail('Card details are unavailable. Please refresh and try again.')
    return
  }

  const { error, paymentIntent } = await stripe.confirmCardPayment(intentResult.clientSecret!, {
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
}

async function handleRecurringDonation({
  stripe,
  elements,
  userId,
  userEmail,
  values,
  finalAmount,
  feesCovered,
  usingSavedCard,
  fullName,
  addressParams,
  pusherCallbacks,
  fail,
  setupPusherListenerRecurring
}: SharedArgs & {
  setupPusherListenerRecurring: ReturnType<typeof usePaymentProcessor>['setupPusherListenerRecurring']
}) {
  const frequency: 'monthly' | 'yearly' = values.donationType === 'monthly' ? 'monthly' : 'yearly'

  const recurringBase = {
    userId,
    email: userEmail,
    name: fullName,
    amount: finalAmount,
    frequency,
    coverFees: values.coverFees,
    feesCovered,
    ...addressParams,
    notes: values.notes,
    campaignId: values.campaignId,
    phone: values.phone
  }

  if (usingSavedCard) {
    const result = await createSubscriptionWithSavedCard({
      ...recurringBase,
      savedCardId: values.selectedCardId
    })

    if (!result.success) {
      fail(result.error || 'Failed to create the subscription. Please try again.')
      return
    }

    setupPusherListenerRecurring(result, ...pusherCallbacks)
    return
  }

  const setupResult = await createSetupIntentForSubscription({
    userId,
    email: userEmail,
    name: fullName,
    amount: finalAmount,
    frequency,
    coverFees: values.coverFees,
    feesCovered,
    phone: values.phone
  })

  if (!setupResult.success) {
    fail(setupResult.error || 'Failed to start the subscription. Please try again.')
    return
  }

  const cardElement = elements.getElement(CardElement)

  if (!cardElement) {
    fail('Card details are unavailable. Please refresh and try again.')
    return
  }

  const { error } = await stripe.confirmCardSetup(setupResult.clientSecret, {
    payment_method: { card: cardElement, billing_details: { name: fullName, email: userEmail } }
  })

  if (error) {
    fail(error.message || 'Card confirmation failed. Please try a different card.')
    return
  }

  const subscriptionResult = await createSubscriptionAfterSetup({
    setupIntentId: setupResult.setupIntentId,
    email: userEmail,
    name: fullName,
    frequency,
    amount: finalAmount,
    coverFees: values.coverFees,
    feesCovered,
    ...addressParams,
    notes: values.notes,
    campaignId: values.campaignId,
    phone: values.phone
  })

  if (!subscriptionResult.success) {
    fail(subscriptionResult.error || 'Failed to create the subscription. Please try again.')
    return
  }

  setupPusherListenerRecurring(subscriptionResult, ...pusherCallbacks)
}
