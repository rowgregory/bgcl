'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { store, useFormSelector, useUiSelector } from '@/app/lib/store/store'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { createFormActions, setInputs, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { createPaymentMethod } from '@/app/lib/actions/stripe/createPaymentMethod'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import PaymentMethodForm from '../forms/PaymentMethodForm'
import { getSetupIntentClientSecret } from '@/app/lib/actions/getSetupIntentClientSecret'
import { setClosePaymentMethodModal } from '@/app/lib/store/slices/uiSlice'

const validatePaymentMethodForm = (inputs, setErrors) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.cardholderName || typeof inputs.cardholderName !== 'string' || !inputs.cardholderName.trim()) {
    newErrors.cardholderName = 'Please enter valid cardholder name'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export const PaymentMethodModal = () => {
  const router = useRouter()
  const { paymentMethodModal } = useUiSelector()
  const { isLoading } = useFormSelector()

  const { handleInput, setErrors } = createFormActions('paymentMethodForm', store.dispatch)

  const { forms } = useFormSelector()
  const inputs = forms?.paymentMethodForm?.inputs
  const errors = forms?.paymentMethodForm?.errors

  const stripe = useStripe()
  const elements = useElements()

  const onClose = () => store.dispatch(setClosePaymentMethodModal())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      store.dispatch(
        showToast({
          type: 'error',
          message: 'Stripe not loaded',
          description: 'Please try again later.'
        })
      )
      return
    }

    if (!validatePaymentMethodForm(inputs, setErrors)) return

    store.dispatch(setIsLoading(true))

    try {
      // 1️⃣ Get client secret using server action
      const setupRes = await getSetupIntentClientSecret()

      if (!setupRes.success || !setupRes.clientSecret) {
        throw new Error(setupRes.error || 'Failed to get client secret')
      }

      // 2️⃣ Confirm card setup
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { setupIntent, error } = await stripe.confirmCardSetup(setupRes.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: inputs.cardholderName || undefined
          }
        }
      })

      if (error) throw error

      // 3️⃣ Get payment method ID
      const paymentMethodId =
        typeof setupIntent?.payment_method === 'string' ? setupIntent.payment_method : setupIntent?.payment_method?.id

      if (!paymentMethodId) throw new Error('No payment method ID returned')

      // 4️⃣ Save payment method to database
      const result = await createPaymentMethod(paymentMethodId)

      if (!result.success) {
        throw new Error(result.error || 'Failed to save payment method')
      }

      // 5️⃣ Refresh router and close drawer
      router.refresh()
      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: 'Payment Method Added!',
          description: 'Your card has been successfully added.'
        })
      )
    } catch (error: unknown) {
      const stripeError = error as any
      const declineCode = stripeError?.decline_code
      const errorCode = stripeError?.code

      const errorMessage = (() => {
        switch (declineCode) {
          case 'insufficient_funds':
            return 'Your card has insufficient funds. Please use a different card.'
          case 'lost_card':
          case 'stolen_card':
            return 'Your card was declined. Please contact your bank.'
          case 'expired_card':
            return 'Your card has expired. Please use a different card.'
          case 'incorrect_cvc':
            return 'The security code (CVC) is incorrect. Please check and try again.'
          case 'incorrect_number':
            return 'Your card number is incorrect. Please check and try again.'
          case 'card_velocity_exceeded':
            return 'Too many attempts on this card. Please try again later or use a different card.'
          case 'do_not_honor':
          case 'do_not_try_again':
            return 'Your card was declined. Please contact your bank for more information.'
          case 'fraudulent':
            return 'Your card was declined. Please contact your bank.'
          case 'generic_decline':
            return 'Your card was declined. Please try a different card or contact your bank.'
          default:
            break
        }

        switch (errorCode) {
          case 'card_declined':
            return 'Your card was declined. Please try a different card.'
          case 'expired_card':
            return 'Your card has expired. Please use a different card.'
          case 'incorrect_cvc':
            return 'The security code (CVC) is incorrect.'
          case 'incorrect_zip':
            return 'The ZIP code does not match your card. Please check and try again.'
          case 'invalid_expiry_month':
          case 'invalid_expiry_year':
            return 'Your card expiry date is invalid.'
          case 'invalid_number':
            return 'Your card number is invalid.'
          case 'processing_error':
            return 'A processing error occurred. Please try again in a moment.'
          default:
            return extractErrorMessage(error)
        }
      })()

      store.dispatch(setInputs({ formName: 'paymentMethodForm', data: { error: errorMessage } }))
      store.dispatch(showToast({ type: 'error', message: 'Failed to Add Card', description: errorMessage }))
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {paymentMethodModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="payment-method-modal-title"
              className="w-full max-w-md dark:bg-neutral-900 bg-white border dark:border-neutral-700/50 border-neutral-200 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden"
            >
              <PaymentMethodForm
                inputs={inputs}
                errors={errors}
                handleInput={handleInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                isUpdating={false}
                onClose={onClose}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
