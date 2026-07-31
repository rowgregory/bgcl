'use client'

import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { ICampaign } from '@/types/entities/campaign'
import { IAddress } from '@/types/entities/address.types'
import { IPaymentMethod } from '@/types/entities/payment-method'
import { useEffect, useState } from 'react'
import { store, useFormSelector } from '@/lib/store/store'
import { createFormActions, setInputs } from '@/lib/store/slices/formSlice'
import { useSession } from 'next-auth/react'
import { CheckoutStep1 } from '../../../components/public/checkout/CheckoutStep1'
import { CheckoutStepIndicator } from '../../../components/public/checkout/CheckoutStepIndicator'
import { updateUserName } from '@/lib/actions/user/updateUserName'
import { updateAddress } from '@/lib/actions/address/updateAddress'
import { CheckoutStep2 } from '../../../components/public/checkout/CheckoutStep2'
import { PublicDonateCheckoutForm } from '../../../components/forms/PublicDonateCheckoutForm'
import { DonationFormLeftColumn } from '../../../components/donate-checkout/DonationFormLeftColumn'
import { DonationFormHeader } from '../../../components/donate-checkout/DonationFormHeader'
import { updatePhoneNumber } from '@/lib/actions/user/updatePhoneNumber'

type IPublicDonateClient = {
  campaigns: ICampaign[]
  name: { firstName: string; lastName: string }
  phone: string
  address: IAddress
  savedCards: IPaymentMethod[]
}

const donateCheckoutStepLabels = ['Sign In', 'User Info', 'Donate']

export function PublicDonateClient({ campaigns, name, address, savedCards, phone }: IPublicDonateClient) {
  // ── Store ─────────────────────────────────────────────────────────────────
  const session = useSession()
  const isAuthed = session.status === 'authenticated'
  const { forms } = useFormSelector()
  const searchParams = useSearchParams()
  const { handleInput, setErrors } = createFormActions('donateCheckoutForm', store.dispatch)

  // ── Derived ───────────────────────────────────────────────────────────────
  const hasUserInfo = !!(name?.firstName?.trim() && name?.lastName?.trim() && address && phone?.trim())
  const campaignName = searchParams.get('campaignName')
  const inputs = forms?.donateCheckoutForm?.inputs
  const errors = forms?.donateCheckoutForm?.errors

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
    store.dispatch(setInputs({ formName: 'donateCheckoutForm', data: { ...name, ...address, ...{ phone } } }))
  }, [address, name, phone])

  useEffect(() => {
    if (!stepFromUrl) return
    setStep(hasUserInfo ? 3 : 2)
  }, [stepFromUrl, hasUserInfo])

  const handleStep2 = async () => {
    const updates = []

    if (inputs?.firstName && inputs?.lastName) {
      updates.push(updateUserName({ firstName: inputs.firstName, lastName: inputs.lastName }))
    }
    if (inputs?.phone) {
      updates.push(updatePhoneNumber({ phone: inputs.phone }))
    }
    if (inputs?.addressLine1) {
      updates.push(
        updateAddress({
          addressLine1: inputs.addressLine1,
          addressLine2: inputs.addressLine2,
          city: inputs.city,
          state: inputs.state,
          zipPostalCode: inputs.zipPostalCode,
          country: 'US'
        })
      )
    }

    await Promise.all(updates)
    setStep(3)
  }

  return (
    <div className="pb-20 sm:pb-0">
      {/* Header */}
      <DonationFormHeader />

      {/* Main Content */}
      <div className=" min-h-[calc(100vh-493px)] h-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Impact Stats */}
          <DonationFormLeftColumn />

          {/* Right Column - Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            {/* Step Indicator */}
            <CheckoutStepIndicator
              current={step}
              total={donateCheckoutStepLabels.length}
              labels={donateCheckoutStepLabels}
            />

            {/* Sign In */}
            {step === 1 && <CheckoutStep1 redirectTo="/donate?step=2" />}

            {/* User Info */}
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

            {step === 3 && (
              <PublicDonateCheckoutForm
                campaignName={campaignName}
                campaigns={campaigns}
                savedCards={savedCards}
                inputs={inputs}
                setStep={setStep}
              />
            )}

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-sm dark:text-zinc-500 text-neutral-600"
            >
              <p>501(c)(3) Nonprofit Organization</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
