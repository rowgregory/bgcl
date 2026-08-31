'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Address, PaymentMethod } from '@prisma/client'

import { CheckoutStep1 } from '@/components/public/checkout/CheckoutStep1'
import { CheckoutStep2 } from '@/components/public/checkout/CheckoutStep2'
import { updateUserName } from '@/lib/actions/user/updateUserName'
import { updatePhoneNumber } from '@/lib/actions/user/updatePhoneNumber'
import { updateAddress } from '@/lib/actions/address/updateAddress'
import { DonateCheckoutForm } from '@/app/(payment)/donate/_components/DonateCheckoutForm'
import { DonateShell } from '@/app/(payment)/donate/_components/DonateShell'
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
  isAuthed: boolean
}

// Fields step 2 collects, validated before advancing
const STEP_2_FIELDS = ['firstName', 'lastName', 'phone', 'addressLine1', 'city', 'state', 'zipPostalCode'] as const

export function DonateCheckoutClient({ campaigns, name, address, savedCards, phone, isAuthed }: Props) {
  const searchParams = useSearchParams()
  const campaignName = searchParams.get('campaignName')

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

  const [saveError, setSaveError] = useState('')

  const handleStep2 = async () => {
    const valid = await trigger(STEP_2_FIELDS)
    if (!valid) return

    setSaveError('')
    const values = getValues()

    try {
      const results = await Promise.all([
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

      if (results.some((r) => r && r.success === false)) {
        setSaveError('We could not save your details. Please try again.')
        return
      }

      setStep(3)
    } catch {
      setSaveError('We could not save your details. Please try again.')
    }
  }

  return (
    <DonateShell step={step}>
      <FormProvider {...methods}>
        {step === 1 && <CheckoutStep1 redirectTo="/donate" />}

        {step === 2 && (
          <>
            <CheckoutStep2 onSubmit={handleStep2} />
            {saveError && (
              <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
                {saveError}
              </p>
            )}
          </>
        )}

        {step === 3 && (
          <DonateCheckoutForm
            campaignName={campaignName}
            campaigns={campaigns}
            savedCards={savedCards}
            setStep={setStep}
          />
        )}
      </FormProvider>
    </DonateShell>
  )
}
