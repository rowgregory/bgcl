'use client'

import { createSetupIntentForSubscription } from '../../actions/stripe/createSetupIntentForSubscription'
import { createSubscriptionAfterSetup } from '../../actions/stripe/createSubscriptionAfterSetup'
import { createSubscriptionWithSavedCard } from '../../actions/stripe/createSubscriptionWithSavedCard'
import { cardPaymentMethod, getCardElement } from '../paymentCard'
import { donationFrequency, type SubmitContext } from './submitContext'

export async function handleRecurringDonation(context: SubmitContext) {
  return context.usingSavedCard ? handleSavedCardSubscription(context) : handleNewCardSubscription(context)
}

/** One call: the card is already on file, so the server can price and charge it */
async function handleSavedCardSubscription(context: SubmitContext) {
  const { userEmail, values, baseAmount, fullName, address, processor, pusherCallbacks, fail } = context

  const result = await createSubscriptionWithSavedCard({
    email: userEmail,
    name: fullName,
    baseAmount,
    frequency: donationFrequency(context),
    coverFees: values.coverFees,
    address,
    notes: values.notes,
    campaignId: values.campaignId,
    phone: values.phone,
    savedCardId: values.selectedCardId
  })

  if (!result.success) {
    fail(result.error || 'Failed to create the subscription. Please try again.')
    return
  }

  processor.setupPusherListenerRecurring(result.data, ...pusherCallbacks)
}

/**
 * Three steps: reserve the amount and fee on a setup intent, confirm the card
 * against it, then create the subscription priced from what the intent recorded.
 */
async function handleNewCardSubscription(context: SubmitContext) {
  const { stripe, userEmail, values, baseAmount, fullName, address, processor, pusherCallbacks, fail } = context

  const setupResult = await createSetupIntentForSubscription({
    email: userEmail,
    name: fullName,
    baseAmount,
    frequency: donationFrequency(context),
    coverFees: values.coverFees,
    phone: values.phone
  })

  if (!setupResult.success || !setupResult.data) {
    fail(setupResult.error || 'Failed to start the subscription. Please try again.')
    return
  }

  const { clientSecret, setupIntentId } = setupResult.data

  if (!clientSecret) {
    fail('Could not start the setup. Please try again.')
    return
  }

  const cardElement = getCardElement(context)
  if (!cardElement) return

  const { error } = await stripe.confirmCardSetup(clientSecret, {
    payment_method: cardPaymentMethod(context, cardElement)
  })

  if (error) {
    fail(error.message || 'Card confirmation failed. Please try a different card.')
    return
  }

  const subscriptionResult = await createSubscriptionAfterSetup({
    setupIntentId,
    email: userEmail,
    name: fullName,
    address,
    notes: values.notes,
    campaignId: values.campaignId,
    phone: values.phone
  })

  if (!subscriptionResult.success) {
    fail(subscriptionResult.error || 'Failed to create the subscription. Please try again.')
    return
  }

  processor.setupPusherListenerRecurring(subscriptionResult.data, ...pusherCallbacks)
}
