'use client'

import { useCallback, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { PaymentMethod } from '@prisma/client'
import { useDefaultCard } from '@/lib/hooks/useDefaultCard'
import { useTicketCheckoutSubmit } from '@/lib/hooks/useTicketCheckoutSubmit'
import { SavedCardSelector } from '@/app/(payment)/_components/SavedCardSelector'
import FormError from '@/components/_shared/FormError'
import { CheckoutStep3UserInfo } from '@/app/(payment)/_components/CheckoutStep3UserInfo'
import { SubmitButton } from '@/app/(payment)/_components/SubmitButton'
import { useCartStore, useCartHasHydrated } from '@/stores/useCartStore'
import { TicketCheckoutSalesWindowNotice } from './TicketCheckoutSalesWindowNotice'
import { TicketCheckoutFormInput } from '@/lib/validations/ticket-checkout.validation'
import { ToggleCard } from '@/components/_shared/ToggleCard'
import { CardElementField } from '../../_components/CardElementField'
import { SaveCardToggle } from '../../_components/SaveCardToggle'
import { CoverFeesToggle } from '../../_components/CoverFeesToggle'
import { formatCents } from '@/lib/utils/currency.utils'
import { useTicketTotals } from '@/lib/hooks/useTicketTotals'

type Props = {
  savedCards: PaymentMethod[]
  setStep: (step: number) => void
  showAttendingToggle: boolean
}

export function TicketCheckoutForm({ savedCards, setStep, showAttendingToggle }: Props) {
  const items = useCartStore((s) => s.items)
  const hasHydrated = useCartHasHydrated()

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useFormContext<TicketCheckoutFormInput>()

  // Stripe Elements owns card validity, so it stays out of the form
  const [cardComplete, setCardComplete] = useState(false)

  const values = watch()
  const coverFees = values.coverFees

  const setDefaultCard = useCallback((value: string) => setValue('selectedCardId', value, { shouldDirty: true }), [setValue])
  useDefaultCard(savedCards, setDefaultCard)

  const { baseAmountInCents, feeCents, finalAmount } = useTicketTotals(items, coverFees)

  // ── Buyer ─────────────────────────────────────────────────────────────────
  const usingSavedCard = Boolean(values.selectedCardId && !values.useNewCard)
  const fullName = `${values.firstName?.trim() ?? ''} ${values.lastName?.trim() ?? ''}`.trim()
  const hasName = Boolean(values.firstName || values.lastName)
  const hasAddress = Boolean(values.addressLine1)

  const derivedAddress = hasAddress
    ? {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        zipPostalCode: values.zipPostalCode
      }
    : null

  const { submitCheckout, isProcessing } = useTicketCheckoutSubmit({
    baseAmount: baseAmountInCents,
    usingSavedCard,
    fullName
  })

  const onSubmit = handleSubmit(submitCheckout)

  // ── Sales window ──────────────────────────────────────────────────────────
  // A cart holds one event at a time, so the first item carries the window
  const salesStartDate = items[0]?.ticketSalesStartDate ?? null
  const salesEndDate = items[0]?.ticketSalesEndDate ?? null

  const [salesStarted, setSalesStarted] = useState(() => !salesStartDate || new Date(salesStartDate).getTime() <= Date.now())
  const [salesEnded, setSalesEnded] = useState(() => Boolean(salesEndDate && new Date(salesEndDate).getTime() < Date.now()))

  useEffect(() => {
    if (!salesStartDate && !salesEndDate) return

    const check = () => {
      const now = Date.now()
      // setState with an unchanged value is a no-op, so this only re-renders
      // on the two moments that actually matter
      setSalesStarted(!salesStartDate || new Date(salesStartDate).getTime() <= now)
      setSalesEnded(Boolean(salesEndDate && new Date(salesEndDate).getTime() < now))
    }

    check()
    const id = setInterval(check, 1000)
    return () => clearInterval(id)
  }, [salesStartDate, salesEndDate])

  // ── Gates ─────────────────────────────────────────────────────────────────
  const isEmpty = hasHydrated && items.length === 0
  const salesOpen = salesStarted && !salesEnded
  const canPay = hasHydrated && !isEmpty && salesOpen && hasName && hasAddress
  const isValid = canPay && (usingSavedCard || cardComplete)
  const isBusy = isSubmitting || isProcessing

  useEffect(() => {
    if (!canPay) setCardComplete(false)
  }, [canPay])

  // ── What renders ──────────────────────────────────────────────────────────
  const showSavedCardSelector = savedCards.length > 0
  const showCardElement = savedCards.length === 0 || values.useNewCard
  const showSaveCardToggle = !usingSavedCard

  const showMissingInfoNotice = !isEmpty && salesOpen && (!hasName || !hasAddress)
  const showSalesWindowNotice = !isEmpty && !salesOpen
  const missingField = !hasName ? 'name' : 'mailing address'

  return (
    <div>
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-8">Payment</h2>

      <form onSubmit={onSubmit} noValidate className="flex flex-col">
        <div className="pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <CheckoutStep3UserInfo address={derivedAddress} name={fullName} setStep={setStep} phone={values.phone} />
        </div>

        {showAttendingToggle && (
          <div className="py-8 border-b border-neutral-200 dark:border-neutral-800">
            <Controller
              name="attendingEvent"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ToggleCard
                  checked={value ?? true}
                  onChange={onChange}
                  title="I will be attending the event"
                  description="Let us know if you plan to join us on the night"
                />
              )}
            />
          </div>
        )}

        {canPay && (
          <fieldset className="border-0 p-0 m-0 py-8">
            <legend className="sr-only">Payment</legend>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5" aria-hidden="true">
              Payment
            </p>

            <div className="space-y-5">
              {showSavedCardSelector && (
                <SavedCardSelector
                  savedCards={savedCards}
                  selectedCardId={values.selectedCardId}
                  useNewCard={values.useNewCard}
                  onSelectCard={(id) => setValue('selectedCardId', id, { shouldDirty: true })}
                  onUseNewCard={() => {
                    setValue('useNewCard', true, { shouldDirty: true })
                    setValue('selectedCardId', '', { shouldDirty: true })
                  }}
                  onUseSavedCard={() => {
                    setValue('useNewCard', false, { shouldDirty: true })
                    setValue('selectedCardId', savedCards[0]?.stripePaymentId ?? '', { shouldDirty: true })
                    setValue('saveCard', false, { shouldDirty: true })
                  }}
                />
              )}

              {showCardElement && <CardElementField onChange={setCardComplete} />}

              {/* Nothing to save when paying with a card already on file */}
              {showSaveCardToggle && <SaveCardToggle />}

              <CoverFeesToggle feeCents={feeCents} />
            </div>
          </fieldset>
        )}

        <div className="space-y-4 pt-2">
          <FormError />

          {isEmpty && (
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
              Your cart is empty. Add tickets before checking out.
            </p>
          )}

          {showMissingInfoNotice && (
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">Add your {missingField} above to continue.</p>
          )}

          {showSalesWindowNotice && (
            <TicketCheckoutSalesWindowNotice
              salesEndDate={salesEndDate}
              salesEnded={salesEnded}
              salesStartDate={salesStartDate}
              savedCards={savedCards}
            />
          )}

          <SubmitButton isSubmitting={isBusy} isValid={isValid} label={`Pay ${formatCents(finalAmount)}`} />
        </div>
      </form>
    </div>
  )
}
