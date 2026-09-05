'use client'

import { useElements, useStripe } from '@stripe/react-stripe-js'
import { useSession } from 'next-auth/react'
import type { DonationFormInput, DonationFormValues } from '@/lib/validations/donation.validation'
import { usePaymentProcessor } from './usePaymentProcessor'
import { usePaymentStatus } from './usePaymentStatus'
import { handleOneTimeDonation } from './donation/handleOneTimeDonation'
import { handleRecurringDonation } from './donation/handleRecurringDonation'
import type { SubmitContext } from './donation/submitContext'

type Args = {
  /** The donation itself, in cents. The server adds the fee when covered. */
  baseAmount: number
  usingSavedCard: boolean
  fullName: string
}

export function useDonationSubmit({ baseAmount, usingSavedCard, fullName }: Args) {
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()

  const processor = usePaymentProcessor()
  const { isProcessing, start, fail, pusherCallbacks } = usePaymentStatus<DonationFormInput>()

  const userEmail = session?.user?.email

  const submitDonation = async (values: DonationFormValues) => {
    if (!stripe || !elements) {
      fail('Payments are still loading. Try again in a moment.')
      return
    }

    if (!userEmail) {
      fail('Your session expired. Please sign in and try again.')
      return
    }

    start()

    const context: SubmitContext = {
      stripe,
      elements,
      userEmail,
      values,
      baseAmount,
      usingSavedCard,
      fullName,
      address: {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        zipPostalCode: values.zipPostalCode
      },
      processor,
      pusherCallbacks,
      fail
    }

    try {
      if (values.donationType === 'once') {
        await handleOneTimeDonation(context)
      } else {
        await handleRecurringDonation(context)
      }
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return { submitDonation, isProcessing }
}
