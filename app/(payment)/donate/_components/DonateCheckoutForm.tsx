'use client'

import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { PaymentMethod } from '@prisma/client'

import { grossUpCents } from '@/lib/utils/stripeFees'
import { getDonateCheckoutAmount } from '@/lib/utils/getDonateCheckoutAmount'
import { useDefaultCard } from '@/lib/hooks/useDefaultCard'
import { useDonationSubmit } from '@/lib/hooks/useDonationSubmit'
import { SavedCardSelector } from '@/app/(payment)/_components/SavedCardSelector'
import { SubmitButton } from '@/app/(payment)/_components/SubmitButton'
import FormError from '@/components/_shared/FormError'
import { CheckoutStep3UserInfo } from '@/app/(payment)/_components/CheckoutStep3UserInfo'
import type { DonationFormInput } from '@/lib/validations/donation.validation'
import { DonateCampaignSelectionAndNotes } from './DonateCampaignSelectionAndNotes'
import { CampaignWithCount } from '@/types/campaign.types'
import { DonateAmountSection } from './DonateAmountSection'
import { CardElementField } from '../../_components/CardElementField'
import { SaveCardToggle } from '../../_components/SaveCardToggle'
import { CoverFeesToggle } from '../../_components/CoverFeesToggle'
import { formatCents } from '@/lib/utils/currency.utils'

type Props = {
  campaignName?: string | null
  campaigns: CampaignWithCount[]
  savedCards: PaymentMethod[]
  setStep: (step: number) => void
}

const MIN_DONATION = 5

export function DonateCheckoutForm({ campaignName, campaigns, savedCards, setStep }: Props) {
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useFormContext<DonationFormInput>()

  // Stripe Elements owns card validity, so it stays out of the form
  const [cardComplete, setCardComplete] = useState(false)

  const values = watch()

  const setDefaultCard = useCallback((value: string) => setValue('selectedCardId', value, { shouldDirty: true }), [setValue])
  useDefaultCard(savedCards, setDefaultCard)

  // Preselect the campaign the visitor arrived from
  useEffect(() => {
    if (!campaignName) return

    const match = campaigns.find((campaign) => campaign.name === campaignName)
    if (match) setValue('campaignId', match.id)
  }, [campaignName, campaigns, setValue])

  // ── Totals ────────────────────────────────────────────────────────────────
  const baseAmount = getDonateCheckoutAmount(values)

  const baseAmountInCents = Math.round(baseAmount * 100)
  const feeCents = grossUpCents(baseAmountInCents)
  const finalAmount = baseAmountInCents + (values.coverFees ? feeCents : 0)

  // ── Donor ─────────────────────────────────────────────────────────────────
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

  const { submitDonation, isProcessing } = useDonationSubmit({
    baseAmount: baseAmountInCents,
    usingSavedCard,
    fullName
  })

  const onSubmit = handleSubmit(submitDonation)

  // ── Gates ─────────────────────────────────────────────────────────────────
  const meetsMinimum = baseAmount >= MIN_DONATION
  const isValid = (usingSavedCard || cardComplete) && hasName && hasAddress && meetsMinimum
  const isBusy = isSubmitting || isProcessing

  // ── What renders ──────────────────────────────────────────────────────────
  const showSavedCardSelector = savedCards.length > 0
  const showCardElement = savedCards.length === 0 || values.useNewCard
  const showSaveCardToggle = !usingSavedCard

  const showMinimumNotice = !meetsMinimum
  const showMissingInfoNotice = meetsMinimum && (!hasName || !hasAddress)
  const missingField = !hasName ? 'name' : 'mailing address'

  return (
    <div>
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-8">Make your donation</h2>

      <form onSubmit={onSubmit} noValidate className="flex flex-col">
        <div className="pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <DonateAmountSection />
        </div>

        <div className="py-8 border-b border-neutral-200 dark:border-neutral-800">
          <CheckoutStep3UserInfo address={derivedAddress} name={fullName} setStep={setStep} phone={values.phone} />
        </div>

        <div className="py-8 border-b border-neutral-200 dark:border-neutral-800">
          <DonateCampaignSelectionAndNotes campaigns={campaigns} />
        </div>

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

        <div className="space-y-4 pt-2">
          <FormError />

          {showMinimumNotice && (
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">Donations start at ${MIN_DONATION}.</p>
          )}

          {showMissingInfoNotice && (
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">Add your {missingField} above to continue.</p>
          )}

          <SubmitButton isSubmitting={isBusy} isValid={isValid} label={`Donate ${formatCents(finalAmount)}`} />

          <p className="text-xs text-neutral-400 dark:text-neutral-600 text-center">
            Secured by Stripe · Powered by{' '}
            <a className="sqysh-gradient hover:underline" href="https://sqysh.com">
              Sqysh
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
