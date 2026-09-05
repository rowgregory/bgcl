'use client'

import { createPaymentIntentForCheckout } from '../../actions/stripe/createPaymentIntentForCheckout'
import { cardPaymentMethod, getCardElement } from '../paymentCard'
import { type SubmitContext } from './submitContext'

export async function handleOneTimeDonation(context: SubmitContext) {
  const { stripe, userEmail, values, baseAmount, usingSavedCard, fullName, address, processor, pusherCallbacks, fail } = context

  const intentResult = await createPaymentIntentForCheckout({
    name: fullName,
    email: userEmail,
    amount: baseAmount,
    orderType: 'ONE_TIME_DONATION',
    description: `One-time donation from ${fullName}`,
    saveCard: values.saveCard,
    coverFees: values.coverFees,
    address,
    savedCardId: usingSavedCard ? values.selectedCardId : undefined,
    campaignId: values.campaignId,
    notes: values.notes,
    phone: values.phone
  })

  if (!intentResult.success || !intentResult.data) {
    fail(intentResult.error || 'Failed to start the donation. Please try again.')
    return
  }

  // A saved card is confirmed server-side, so there is nothing to do here but
  // wait for the webhook to report back over Pusher
  if (usingSavedCard) {
    processor.setupPusherListenerOneTime(false, undefined, ...pusherCallbacks)
    return
  }

  const { clientSecret } = intentResult.data

  if (!clientSecret) {
    fail('Could not start the payment. Please try again.')
    return
  }

  const cardElement = getCardElement(context)
  if (!cardElement) return

  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: cardPaymentMethod(context, cardElement)
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
}
