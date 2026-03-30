'use client'

import { motion } from 'framer-motion'
import { store, useCartSelector, useFormSelector } from '@/app/lib/store/store'
import { TicketCheckoutForm } from '@/app/components/forms/TicketCheckoutForm'
import { useSession } from 'next-auth/react'
import { IPaymentMethod } from '@/types/entities/payment-method'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { IAddress } from '@/types/entities/address.types'
import { createFormActions, setInputs } from '@/app/lib/store/slices/formSlice'
import { updateUserName } from '@/app/lib/actions/updateUserName'
import { updateAddress } from '@/app/lib/actions/updateAddress'
import { CheckoutHeader } from '../ticket-checkout/TicketCheckoutHeader'
import { EmptyState } from '../ticket-checkout/TicketCheckoutEmptyState'
import { TicketCheckoutOrderSummary } from '../ticket-checkout/TicketCheckoutOrderSummary'
import { CheckoutStep1 } from '../common/CheckoutStep1'
import { CheckoutStepIndicator } from '../common/CheckoutStepIndicator'
import { CheckoutStep2 } from '../common/CheckoutStep2'

type IPublicCheckoutClient = {
  savedCards: IPaymentMethod[]
  userAddress: IAddress
  userName: { firstName: string; lastName: string }
}

const ticketCheckoutStepLabels = ['Sign In', 'User Info', 'Payment']

export function PublicTicketCheckoutClient({ savedCards, userAddress, userName }: IPublicCheckoutClient) {
  const router = useRouter()

  // ── Store ─────────────────────────────────────────────────────────────────
  const { items } = useCartSelector()
  const session = useSession()
  const isAuthed = session.status === 'authenticated'
  const { forms } = useFormSelector()
  const { handleInput, setErrors } = createFormActions('ticketCheckoutForm', store.dispatch)

  // ── Derived ───────────────────────────────────────────────────────────────
  const inputs = forms?.ticketCheckoutForm?.inputs
  const errors = forms?.ticketCheckoutForm?.errors
  const hasUserInfo = !!(userName && userAddress)

  // ── UI state ──────────────────────────────────────────────────────────────
  const params = useSearchParams()
  const stepFromUrl = params.get('step')
  const [step, setStep] = useState(() => {
    if (!isAuthed) return 1
    if (hasUserInfo) return 3
    return 2
  })

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!stepFromUrl) return
    setStep(hasUserInfo ? 3 : 2)
  }, [stepFromUrl, hasUserInfo])

  useEffect(() => {
    store.dispatch(
      setInputs({
        formName: 'ticketCheckoutForm',
        data: {
          ...userName,
          ...userAddress,
          ...(step === 3 && { coverFees: true, loading: false, useNewCard: savedCards?.length === 0 ? true : false })
        }
      })
    )
  }, [savedCards?.length, step, userAddress, userName])

  const handleStep2 = async () => {
    if (inputs?.firstName && inputs?.lastName) {
      await updateUserName({ firstName: inputs.firstName, lastName: inputs.lastName })
    }
    if (inputs?.addressLine1) {
      await updateAddress({
        addressLine1: inputs.addressLine1,
        addressLine2: inputs.addressLine2,
        city: inputs.city,
        state: inputs.state,
        zipPostalCode: inputs.zipPostalCode,
        country: 'US'
      })
    }
    router.refresh()
    setStep(3)
  }

  if (items?.length === 0) return <EmptyState />

  return (
    <div className="pb-20 sm:pb-0">
      <CheckoutHeader />

      <div className="px-4 sm:px-6 md:px-12">
        <div className="max-w-4xl mx-auto py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <TicketCheckoutOrderSummary items={items} coverFees={inputs?.coverFees} />

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <CheckoutStepIndicator
                current={step}
                total={ticketCheckoutStepLabels.length}
                labels={ticketCheckoutStepLabels}
              />

              {step === 1 && <CheckoutStep1 redirectTo="/checkout?step=2" />}

              {step === 2 && (
                <CheckoutStep2
                  onSubmit={handleStep2}
                  isLoading={false}
                  errors={errors}
                  handleInput={handleInput}
                  inputs={inputs}
                  setErrors={setErrors}
                />
              )}

              {step === 3 && <TicketCheckoutForm savedCards={savedCards} inputs={inputs} setStep={setStep} />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
