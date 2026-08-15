'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Address, PaymentMethod } from '@prisma/client'

import { CheckoutStep1 } from '@/components/public/checkout/CheckoutStep1'
import { CheckoutStep2 } from '@/components/public/checkout/CheckoutStep2'
import { CheckoutStepIndicator } from '@/components/public/checkout/CheckoutStepIndicator'
import { updateUserName } from '@/lib/actions/user/updateUserName'
import { updatePhoneNumber } from '@/lib/actions/user/updatePhoneNumber'
import { updateAddress } from '@/lib/actions/address/updateAddress'
import { PublicDonateCheckoutForm } from '@/app/(public)/donate/_components/PublicDonateCheckoutForm'
import { DonationFormLeftColumn } from '@/app/(public)/donate/_components/DonationFormLeftColumn'
import { DonationFormHeader } from '@/app/(public)/donate/_components/DonationFormHeader'
import {
  EMPTY_DONATION,
  donationSchema,
  type DonationFormInput,
  type DonationFormValues
} from '@/lib/validations/donation.validation'
import type { CampaignWithCount } from '@/types/campaign.types'

type Props = {
  campaigns: CampaignWithCount[]
  name: { firstName: string; lastName: string } | null
  phone: string | null
  address: Address | null
  savedCards: PaymentMethod[]
}

const donateCheckoutStepLabels = ['Sign In', 'User Info', 'Donate']

// Fields step 2 collects, validated before advancing
const STEP_2_FIELDS = ['firstName', 'lastName', 'phone', 'addressLine1', 'city', 'state', 'zipPostalCode'] as const

export function PublicDonateClient({ campaigns, name, address, savedCards, phone }: Props) {
  const { status } = useSession()
  const isAuthed = status === 'authenticated'

  const searchParams = useSearchParams()
  const campaignName = searchParams.get('campaignName')
  const stepFromUrl = searchParams.get('step')

  const hasUserInfo = Boolean(name?.firstName?.trim() && name?.lastName?.trim() && address && phone?.trim())

  const methods = useForm<DonationFormInput, unknown, DonationFormValues>({
    resolver: zodResolver(donationSchema),
    mode: 'onTouched',
    defaultValues: {
      ...EMPTY_DONATION,
      firstName: name?.firstName ?? '',
      lastName: name?.lastName ?? '',
      phone: phone ?? '',
      addressLine1: address?.addressLine1 ?? '',
      addressLine2: address?.addressLine2 ?? '',
      city: address?.city ?? '',
      state: address?.state ?? '',
      zipPostalCode: address?.zipPostalCode ?? '',
      coverFees: true,
      useNewCard: savedCards.length === 0
    }
  })

  const { trigger, getValues } = methods

  const [step, setStep] = useState(() => {
    if (!isAuthed) return 1
    return hasUserInfo ? 3 : 2
  })

  useEffect(() => {
    if (!stepFromUrl) return
    setStep(hasUserInfo ? 3 : 2)
  }, [stepFromUrl, hasUserInfo])

  const handleStep2 = async () => {
    const valid = await trigger(STEP_2_FIELDS)
    if (!valid) return

    const values = getValues()

    await Promise.all([
      updateUserName({ firstName: values.firstName, lastName: values.lastName }),
      updatePhoneNumber({ phone: values.phone }),
      updateAddress({
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        zipPostalCode: values.zipPostalCode,
        country: 'US'
      })
    ])

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

            <FormProvider {...methods}>
              {/* Sign In */}
              {step === 1 && <CheckoutStep1 redirectTo="/donate?step=2" />}

              {/* User Info */}
              {step === 2 && <CheckoutStep2 onSubmit={handleStep2} />}

              {step === 3 && (
                <PublicDonateCheckoutForm
                  campaignName={campaignName}
                  campaigns={campaigns}
                  savedCards={savedCards}
                  setStep={setStep}
                />
              )}
            </FormProvider>

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
