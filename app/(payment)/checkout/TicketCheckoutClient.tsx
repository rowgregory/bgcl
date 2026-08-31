'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Address, PaymentMethod } from '@prisma/client'

import { updateUserName } from '@/lib/actions/user/updateUserName'
import { updateAddress } from '@/lib/actions/address/updateAddress'
import { updatePhoneNumber } from '@/lib/actions/user/updatePhoneNumber'
import { CheckoutStep1 } from '@/components/public/checkout/CheckoutStep1'
import { CheckoutStep2 } from '@/components/public/checkout/CheckoutStep2'
import { useCartStore } from '@/stores/useCartStore'
import { EmptyState } from './_components/TicketCheckoutEmptyState'
import { TicketCheckoutForm } from './_components/TicketCheckoutForm'
import {
  EMPTY_TICKET_CHECKOUT,
  TicketCheckoutFormInput,
  TicketCheckoutFormValues,
  ticketCheckoutSchema
} from '@/lib/validations/ticket-checkout.validation'
import { TicketCheckoutShell } from './_components/TicketCheckoutShell'

type Props = {
  savedCards: PaymentMethod[]
  userAddress: Address | null
  userName: { firstName: string; lastName: string } | null
  userEmail: string | null
  isAuthed: boolean
  userPhone: string | null
}

// Fields step 2 collects, validated before advancing
const STEP_2_FIELDS = ['firstName', 'lastName', 'phone', 'addressLine1', 'city', 'state', 'zipPostalCode'] as const

export function TicketCheckoutClient({ savedCards, userAddress, userName, userEmail, isAuthed, userPhone }: Props) {
  const router = useRouter()
  const items = useCartStore((s) => s.items)

  const hasUserInfo = Boolean(userName && userAddress && userPhone)

  const methods = useForm<TicketCheckoutFormInput, unknown, TicketCheckoutFormValues>({
    resolver: zodResolver(ticketCheckoutSchema),
    mode: 'onTouched',
    defaultValues: {
      ...EMPTY_TICKET_CHECKOUT,
      firstName: userName?.firstName ?? '',
      lastName: userName?.lastName ?? '',
      addressLine1: userAddress?.addressLine1 ?? '',
      addressLine2: userAddress?.addressLine2 ?? '',
      city: userAddress?.city ?? '',
      state: userAddress?.state ?? '',
      zipPostalCode: userAddress?.zipPostalCode ?? '',
      coverFees: true,
      useNewCard: savedCards.length === 0,
      phone: userPhone ?? ''
    }
  })

  const { watch, setValue, trigger, getValues } = methods

  const coverFees = watch('coverFees')

  const [step, setStep] = useState(() => {
    if (!isAuthed) return 1
    return hasUserInfo ? 3 : 2
  })

  const [saveError, setSaveError] = useState('')

  // Session resolves after first render, so seed the email once it lands
  useEffect(() => {
    if (userEmail && !getValues('email')) setValue('email', userEmail)
  }, [getValues, setValue, userEmail])

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

      router.refresh()
      setStep(3)
    } catch {
      setSaveError('We could not save your details. Please try again.')
    }
  }

  if (items.length === 0) return <EmptyState />

  return (
    <TicketCheckoutShell step={step} items={items} coverFees={coverFees}>
      <FormProvider {...methods}>
        {step === 1 && <CheckoutStep1 redirectTo="/checkout" />}

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

        {step === 3 && <TicketCheckoutForm savedCards={savedCards} setStep={setStep} />}
      </FormProvider>
    </TicketCheckoutShell>
  )
}
