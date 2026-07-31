import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useSession } from 'next-auth/react'
import { setDonateCheckoutForm as setForm } from '../utils/setDonateCheckoutForm'
import { getDonateCheckoutAmount } from '../utils/getDonateCheckoutAmount'
import { createPaymentIntentForCheckout } from '../actions/stripe/createPaymentIntentForCheckout'
import { createSubscriptionWithSavedCard } from '../actions/stripe/createSubscriptionWithSavedCard'
import { createSetupIntentForSubscription } from '../actions/stripe/createSetupIntentForSubscription'
import { createSubscriptionAfterSetup } from '../actions/stripe/createSubscriptionAfterSetup'
import { usePaymentProcessor } from './usePaymentProcessor'

export function useDonationSubmit({ inputs, finalAmount, feesCovered, usingSavedCard, fullName }) {
  const stripe = useStripe()
  const elements = useElements()
  const session = useSession()
  const userId = session.data?.user?.id
  const userEmail = session.data?.user?.email
  const { setupPusherListenerOneTime, getPaymentMethodId, setupPusherListenerRecurring } = usePaymentProcessor()

  const pusherCallbacks = [
    (value: string) => setForm({ error: value }),
    (value: string) => setForm({ processingStatus: value }),
    () => setForm({ loading: false })
  ] as const

  const addressParams = {
    address: {
      addressLine1: inputs?.addressLine1,
      addressLine2: inputs?.addressLine2,
      city: inputs?.city,
      state: inputs?.state,
      zipPostalCode: inputs?.zipPostalCode
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    if (getDonateCheckoutAmount(inputs) < 5) return setForm({ error: 'Minimum donation is $5' })
    setForm({ loading: true, error: null, processingStatus: 'processing' })

    try {
      if (inputs?.donationType === 'once') {
        await handleOneTimeDonation({
          stripe,
          elements,
          userId,
          userEmail,
          inputs,
          finalAmount,
          feesCovered,
          usingSavedCard,
          fullName,
          addressParams,
          pusherCallbacks,
          setupPusherListenerOneTime,
          getPaymentMethodId
        })
      } else {
        await handleRecurringDonation({
          stripe,
          elements,
          userId,
          userEmail,
          inputs,
          finalAmount,
          feesCovered,
          usingSavedCard,
          fullName,
          addressParams,
          pusherCallbacks,
          setupPusherListenerRecurring
        })
      }
    } catch (err) {
      setForm({
        loading: false,
        error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        processingStatus: 'failed'
      })
    }
  }

  return { handleSubmit }
}

async function handleOneTimeDonation({
  stripe,
  elements,
  userId,
  userEmail,
  inputs,
  finalAmount,
  feesCovered,
  usingSavedCard,
  fullName,
  addressParams,
  pusherCallbacks,
  setupPusherListenerOneTime,
  getPaymentMethodId
}) {
  const intentResult = await createPaymentIntentForCheckout({
    userId,
    name: fullName,
    email: userEmail,
    amount: finalAmount,
    orderType: 'ONE_TIME_DONATION',
    description: `One-time donation from ${fullName}`,
    saveCard: inputs?.saveCard,
    coverFees: inputs?.coverFees,
    feesCovered,
    ...addressParams,
    savedCardId: usingSavedCard ? inputs?.selectedCardId : undefined,
    campaignId: inputs?.campaign?.id,
    notes: inputs?.notes,
    phone: inputs?.phone
  })

  if (!intentResult.success) throw new Error(intentResult.error || 'Failed to create payment intent')

  if (usingSavedCard) {
    setupPusherListenerOneTime(
      intentResult.paymentIntentId!,
      false,
      inputs?.selectedCardId,
      inputs?.processingStatus,
      ...pusherCallbacks
    )
    return
  }

  const cardElement = elements.getElement(CardElement)
  if (!cardElement) throw new Error('Card element not found')

  const { error, paymentIntent } = await stripe.confirmCardPayment(intentResult.clientSecret!, {
    payment_method: { card: cardElement, billing_details: { name: fullName, email: userEmail } }
  })

  if (error) throw new Error(error.message || 'Payment failed')
  if (paymentIntent?.status === 'succeeded') {
    setupPusherListenerOneTime(
      paymentIntent.id,
      inputs?.saveCard,
      getPaymentMethodId(paymentIntent.payment_method),
      inputs?.processingStatus,
      ...pusherCallbacks
    )
  }
}

async function handleRecurringDonation({
  stripe,
  elements,
  userId,
  userEmail,
  inputs,
  finalAmount,
  feesCovered,
  usingSavedCard,
  fullName,
  addressParams,
  pusherCallbacks,
  setupPusherListenerRecurring
}) {
  const frequency = inputs?.donationType === 'monthly' ? 'monthly' : ('yearly' as 'monthly' | 'yearly')
  const recurringBase = {
    userId,
    email: userEmail,
    name: fullName,
    amount: finalAmount,
    frequency,
    coverFees: inputs?.coverFees,
    feesCovered,
    ...addressParams,
    notes: inputs?.notes,
    campaignId: inputs?.campaign?.id,
    phone: inputs?.phone
  }

  if (usingSavedCard) {
    const result = await createSubscriptionWithSavedCard({ ...recurringBase, savedCardId: inputs?.selectedCardId })
    if (!result.success) throw new Error(result.error || 'Failed to create subscription')
    setupPusherListenerRecurring(result, inputs?.processingStatus, ...pusherCallbacks)
    return
  }

  const setupResult = await createSetupIntentForSubscription({
    userId,
    email: userEmail,
    name: fullName,
    amount: finalAmount,
    frequency,
    coverFees: inputs?.coverFees,
    feesCovered,
    phone: inputs?.phone
  })

  if (!setupResult.success) throw new Error(setupResult.error || 'Failed to create setup intent')

  const cardElement = elements.getElement(CardElement)
  if (!cardElement) throw new Error('Card element not found')

  const { error } = await stripe.confirmCardSetup(setupResult.clientSecret, {
    payment_method: { card: cardElement, billing_details: { name: fullName, email: userEmail } }
  })

  if (error) throw new Error(error.message || 'Card confirmation failed')

  const subscriptionResult = await createSubscriptionAfterSetup({
    setupIntentId: setupResult.setupIntentId,
    email: userEmail,
    name: fullName,
    frequency,
    amount: finalAmount,
    coverFees: inputs?.coverFees,
    feesCovered,
    ...addressParams,
    notes: inputs?.notes,
    campaignId: inputs?.campaign?.id,
    phone: inputs?.phone
  })

  if (!subscriptionResult.success) throw new Error(subscriptionResult.error || 'Failed to create subscription')
  setupPusherListenerRecurring(subscriptionResult, inputs?.processingStatus, ...pusherCallbacks)
}
