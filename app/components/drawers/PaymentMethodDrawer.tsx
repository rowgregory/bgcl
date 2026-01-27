'use client'

import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js'
import { store, useApplicationSelector, useFormSelector } from '@/app/lib/store/store'
import { setClosePaymentMethodDrawer } from '@/app/lib/store/slices/appSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { setIsLoading } from '@/app/lib/store/slices/formSlice'
import { createPaymentMethod } from '@/app/lib/actions/createPaymentMethod'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import Backdrop from '../common/Backdrop'
import Drawer from '../common/Drawer'
import PaymentMethodForm from '../forms/PaymentMethodForm'
import { getSetupIntentClientSecret } from '@/app/lib/actions/getSetupIntentClientSecret'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const PaymentMethodDrawer = () => {
  const router = useRouter()
  const { paymentMethodDrawer } = useApplicationSelector()
  const { isLoading } = useFormSelector()
  const [inputs, setInputs] = useState({ isDefault: false, cardholderName: '' })

  const stripe = useStripe()
  const elements = useElements()

  const onClose = () => store.dispatch(setClosePaymentMethodDrawer())

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setInputs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

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
      const result = await createPaymentMethod({
        stripePaymentMethodId: paymentMethodId,
        isDefault: inputs.isDefault,
        cardholderName: inputs.cardholderName || undefined
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to save payment method')
      }

      // 5️⃣ Refresh router and close drawer
      router.refresh()
      setInputs({ isDefault: false, cardholderName: '' })
      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: 'Payment Method Added!',
          description: 'Your card has been successfully added.'
        })
      )
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: 'Failed to Add Payment Method',
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {paymentMethodDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Form */}
            <Elements stripe={stripePromise}>
              <PaymentMethodForm
                inputs={inputs}
                errors={{}}
                handleInput={handleInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                isUpdating={false}
                onClose={onClose}
              />
            </Elements>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default PaymentMethodDrawer
