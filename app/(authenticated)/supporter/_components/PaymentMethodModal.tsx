'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import PaymentMethodForm from './PaymentMethodForm'
import { getSetupIntentClientSecret } from '@/lib/actions/stripe/getSetupIntentClientSecret'
import Backdrop from '@/components/_shared/Backdrop'
import { usePaymentMethodModal } from '@/stores/drawers'
import { FormProvider, useForm } from 'react-hook-form'
import stripeErrorMessage from '@/lib/utils/stripeErrorMessage'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  EMPTY_PAYMENT_METHOD,
  PaymentMethodFormInput,
  paymentMethodFormSchema,
  PaymentMethodFormValues
} from '@/lib/validations/payment-method.validation'
import { useEscapeKey } from '@/lib/hooks/useEscapeKey'
import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll'
import { PaymentMethod } from '@prisma/client'
import { savePaymentMethod } from '@/lib/actions/stripe/savePaymentMethod'

export default function PaymentMethodModal({ savedCards }: { savedCards: PaymentMethod[] }) {
  const router = useRouter()
  const isFirstCard = savedCards.length === 0

  const stripe = useStripe()
  const elements = useElements()

  const close = usePaymentMethodModal((s) => s.close)
  const isOpen = usePaymentMethodModal((s) => s.isOpen)

  const methods = useForm<PaymentMethodFormInput, unknown, PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodFormSchema),
    defaultValues: { ...EMPTY_PAYMENT_METHOD, isDefault: isFirstCard },
    mode: 'onTouched'
  })

  const { handleSubmit, reset, setError } = methods

  useEscapeKey(close, isOpen)
  useLockBodyScroll(isOpen)

  // Seed on open — the modal stays mounted, so defaultValues alone isn't enough
  useEffect(() => {
    if (!isOpen) return
    reset(EMPTY_PAYMENT_METHOD)
  }, [isOpen, reset])

  const onSubmit = handleSubmit(async (values) => {
    if (!stripe || !elements) {
      setError('root', { message: 'Payments are still loading. Try again in a moment.' })
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError('root', { message: 'Card details are unavailable. Close this window and reopen it.' })
      return
    }

    try {
      const setupRes = await getSetupIntentClientSecret()

      if (!setupRes.success || !setupRes.data?.clientSecret) {
        setError('root', { message: setupRes.error || 'Could not start card setup. Try again.' })
        return
      }

      const { setupIntent, error } = await stripe.confirmCardSetup(setupRes.data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: values.cardholderName }
        }
      })

      if (error) {
        setError('root', { message: stripeErrorMessage(error) })
        return
      }

      const stripePaymentId =
        typeof setupIntent?.payment_method === 'string' ? setupIntent.payment_method : setupIntent?.payment_method?.id

      if (!stripePaymentId) {
        setError('root', { message: 'Stripe did not return a payment method. Try again.' })
        return
      }

      const res = await savePaymentMethod({ stripePaymentId, isDefault: values.isDefault })

      if (!res.success) {
        setError('root', { message: res.error })
        return // must return, or the modal closes over the error
      }

      close()
      router.refresh()
    } catch (error) {
      setError('root', { message: stripeErrorMessage(error) })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="payment-method-modal-title"
              className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-black/30 dark:border-neutral-700/50 dark:bg-neutral-900"
            >
              <FormProvider {...methods}>
                <form id="paymentMethodForm" onSubmit={onSubmit} noValidate>
                  <PaymentMethodForm isFirstCard={isFirstCard} />
                </form>
              </FormProvider>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
