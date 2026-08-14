'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Controller, useFormContext } from 'react-hook-form'
import type { PaymentMethod } from '@prisma/client'

import { calculateStripeFees } from '@/lib/utils/calculateStripeFees'
import { useDefaultCard } from '@/lib/hooks/useDefaultCard'
import { useTicketCheckoutSubmit } from '@/lib/hooks/useTicketCheckoutSubmit'
import { CardElementField } from '@/components/_shared/CardElementField'
import { SavedCardSelector } from '@/components/_shared/SavedCardSelector'
import { CoverFeesToggle } from '@/components/_shared/CoverFeesToggle'
import { SaveCardToggle } from '@/components/_shared/SaveCardToggle'
import FormError from '@/components/_shared/FormError'
import { CheckoutStep3UserInfo } from '@/components/_shared/CheckoutStep3UserInfo'
import CustomSwitch from '@/components/_shared/CustomSwitch'
import { SubmitButton } from '@/components/ui/buttons/SubmitButton'
import { useCartStore } from '@/stores/useCartStore'
import { useConfettiStore } from '@/stores/useConfettiStore'
import { TicketCheckoutSalesWindowNotice } from './TicketCheckoutSalesWindowNotice'
import { TicketCheckoutFormInput } from '@/lib/validations/ticket-checkout.validation'

type Props = {
  savedCards: PaymentMethod[]
  setStep: (step: number) => void
}

export function TicketCheckoutForm({ savedCards, setStep }: Props) {
  const items = useCartStore((s) => s.items)
  const { status } = useSession()
  const isAuthed = status === 'authenticated'

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useFormContext<TicketCheckoutFormInput>()

  // Stripe Elements owns card validity, so it stays out of the form
  const [cardComplete, setCardComplete] = useState(false)

  const coverFees = watch('coverFees')
  const selectedCardId = watch('selectedCardId')
  const useNewCard = watch('useNewCard')
  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const addressLine1 = watch('addressLine1')

  const setDefaultCard = useCallback(
    (value: string) => setValue('selectedCardId', value, { shouldDirty: true }),
    [setValue]
  )
  useDefaultCard(savedCards, setDefaultCard)

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const processingFee = Math.round(calculateStripeFees(totalPrice) * 100) / 100
  const finalAmount = coverFees ? totalPrice + processingFee : totalPrice
  const amountInCents = Math.round(finalAmount * 100)
  const finalAmountDisplay = (amountInCents / 100).toFixed(2)

  const usingSavedCard = Boolean(selectedCardId && !useNewCard)
  const fullName = `${firstName?.trim() ?? ''} ${lastName?.trim() ?? ''}`.trim()
  const hasName = Boolean(firstName || lastName)
  const hasAddress = Boolean(addressLine1)

  const { submitCheckout, isProcessing } = useTicketCheckoutSubmit({
    amountInCents,
    processingFee,
    usingSavedCard,
    fullName
  })

  const onSubmit = handleSubmit(submitCheckout)

  const salesStartDate = items[0]?.ticketSalesStartDate
  const salesEndDate = items[0]?.ticketSalesEndDate

  const [salesStarted, setSalesStarted] = useState(() => !salesStartDate || new Date(salesStartDate) <= new Date())
  const salesEnded = Boolean(salesEndDate && new Date(salesEndDate) < new Date())

  const show = useConfettiStore((s) => s.show)
  const hide = useConfettiStore((s) => s.hide)

  useEffect(() => {
    if (salesStarted || !salesStartDate) return

    const id = setInterval(() => {
      if (new Date(salesStartDate) <= new Date()) {
        show()
        setTimeout(() => hide(), 2000)
        setSalesStarted(true)
        clearInterval(id)
      }
    }, 1000)

    return () => clearInterval(id)
  }, [hide, salesStartDate, salesStarted, show])

  const canPay = salesStarted && !salesEnded && hasName && hasAddress
  const isValid = canPay && (usingSavedCard || cardComplete)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4 sm:p-6 md:p-8 shadow-sm"
    >
      <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900 mb-4 sm:mb-6">Payment Details</h2>
      <div className="flex-1">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-y-12">
          {/* ── Contact ── */}
          <CheckoutStep3UserInfo
            address={
              hasAddress
                ? {
                    addressLine1: watch('addressLine1'),
                    addressLine2: watch('addressLine2'),
                    city: watch('city'),
                    state: watch('state'),
                    zipPostalCode: watch('zipPostalCode')
                  }
                : null
            }
            name={fullName}
            setStep={setStep}
          />

          <Controller
            name="attendingEvent"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomSwitch
                checked={value ?? true}
                onChange={onChange}
                label="I will be attending the event"
                description="Let us know if you plan to join us on the night"
              />
            )}
          />

          {/* ── Payment ── */}
          {canPay && (
            <fieldset className="border-0 p-0 m-0">
              <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
                Payment Method
              </legend>
              <div className="space-y-6">
                {/* ── Saved cards ── */}
                {isAuthed && (
                  <SavedCardSelector
                    savedCards={savedCards}
                    selectedCardId={selectedCardId}
                    useNewCard={useNewCard}
                    onSelectCard={(id) => setValue('selectedCardId', id, { shouldDirty: true })}
                    onUseNewCard={() => {
                      setValue('useNewCard', true, { shouldDirty: true })
                      setValue('selectedCardId', '', { shouldDirty: true })
                    }}
                    onUseSavedCard={() => {
                      setValue('useNewCard', false, { shouldDirty: true })
                      setValue('selectedCardId', savedCards[0]?.stripePaymentId ?? '', { shouldDirty: true })
                    }}
                  />
                )}

                {(!isAuthed || savedCards.length === 0 || useNewCard) && (
                  <CardElementField onChange={setCardComplete} />
                )}

                {/* ── Error ── */}
                <FormError />

                {/* ── Save card ── */}
                <SaveCardToggle />

                {/* ── Cover fees ── */}
                <CoverFeesToggle processingFee={processingFee} />
              </div>
            </fieldset>
          )}

          {/* Sales window notice */}
          {(!salesStarted || salesEnded) && (
            <TicketCheckoutSalesWindowNotice
              salesEndDate={salesEndDate}
              salesEnded={salesEnded}
              salesStartDate={salesStartDate}
              savedCards={savedCards}
            />
          )}

          <SubmitButton
            isSubmitting={isSubmitting || isProcessing}
            isValid={isValid}
            label={`Pay $${finalAmountDisplay}`}
          />
        </form>
      </div>
    </motion.div>
  )
}
