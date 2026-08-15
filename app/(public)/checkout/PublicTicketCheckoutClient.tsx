'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Address, PaymentMethod } from '@prisma/client'

import { updateUserName } from '@/lib/actions/user/updateUserName'
import { updateAddress } from '@/lib/actions/address/updateAddress'
import { TicketCheckoutForm } from '@/app/(public)/checkout/_components/TicketCheckoutForm'
import { CheckoutStep1 } from '@/components/public/checkout/CheckoutStep1'
import { CheckoutStep2 } from '@/components/public/checkout/CheckoutStep2'
import { CheckoutStepIndicator } from '@/components/public/checkout/CheckoutStepIndicator'
import { useCartStore } from '@/stores/useCartStore'
import { TicketCheckoutHeader } from './_components/TicketCheckoutHeader'
import { EmptyState } from './_components/TicketCheckoutEmptyState'
import { TicketCheckoutOrderSummary } from './_components/TicketCheckoutOrderSummary'
import {
  EMPTY_TICKET_CHECKOUT,
  TicketCheckoutFormInput,
  TicketCheckoutFormValues,
  ticketCheckoutSchema
} from '@/lib/validations/ticket-checkout.validation'

type Props = {
  savedCards: PaymentMethod[]
  userAddress: Address | null
  userName: { firstName: string; lastName: string } | null
}

const ticketCheckoutStepLabels = ['Sign In', 'User Info', 'Payment']

// Fields step 2 collects, validated before advancing
const STEP_2_FIELDS = ['firstName', 'lastName', 'addressLine1', 'city', 'state', 'zipPostalCode'] as const

export function PublicTicketCheckoutClient({ savedCards, userAddress, userName }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const items = useCartStore((s) => s.items)
  const { data: session, status } = useSession()
  const isAuthed = status === 'authenticated'

  const hasUserInfo = Boolean(userName && userAddress)

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
      useNewCard: savedCards.length === 0
    }
  })

  const { watch, setValue, trigger, getValues } = methods

  const coverFees = watch('coverFees')

  const stepFromUrl = params.get('step')
  const [step, setStep] = useState(() => {
    if (!isAuthed) return 1
    return hasUserInfo ? 3 : 2
  })

  useEffect(() => {
    if (!stepFromUrl) return
    setStep(hasUserInfo ? 3 : 2)
  }, [stepFromUrl, hasUserInfo])

  // Session resolves after first render, so seed the email once it lands
  useEffect(() => {
    const email = session?.user?.email
    if (email && !getValues('email')) setValue('email', email)
  }, [session?.user?.email, getValues, setValue])

  const handleStep2 = async () => {
    const valid = await trigger(STEP_2_FIELDS)
    if (!valid) return

    const values = getValues()

    await updateUserName({ firstName: values.firstName, lastName: values.lastName })
    await updateAddress({
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      state: values.state,
      zipPostalCode: values.zipPostalCode,
      country: 'US'
    })

    router.refresh()
    setStep(3)
  }

  if (items.length === 0) return <EmptyState />

  return (
    <div className="pb-20 sm:pb-0">
      <TicketCheckoutHeader />

      <div className="px-4 sm:px-6 md:px-12">
        <div className="max-w-4xl mx-auto py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <TicketCheckoutOrderSummary items={items} coverFees={coverFees} />

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <CheckoutStepIndicator
                current={step}
                total={ticketCheckoutStepLabels.length}
                labels={ticketCheckoutStepLabels}
              />

              <FormProvider {...methods}>
                {step === 1 && <CheckoutStep1 redirectTo="/checkout?step=2" />}

                {step === 2 && <CheckoutStep2 onSubmit={handleStep2} />}

                {step === 3 && <TicketCheckoutForm savedCards={savedCards} setStep={setStep} />}
              </FormProvider>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
