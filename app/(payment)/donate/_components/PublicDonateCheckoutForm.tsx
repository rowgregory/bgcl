'use client'

import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { PaymentMethod } from '@prisma/client'

import { calculateStripeFees } from '@/lib/utils/calculateStripeFees'
import { getDonateCheckoutAmount } from '@/lib/utils/getDonateCheckoutAmount'
import { useDefaultCard } from '@/lib/hooks/useDefaultCard'
import { useDonationSubmit } from '@/lib/hooks/useDonationSubmit'
import { SavedCardSelector } from '@/components/_shared/SavedCardSelector'
import { CardElementField } from '@/components/_shared/CardElementField'
import { SaveCardToggle } from '@/components/_shared/SaveCardToggle'
import { CoverFeesToggle } from '@/components/_shared/CoverFeesToggle'
import { SubmitButton } from '@/components/ui/buttons/SubmitButton'
import FormError from '@/components/_shared/FormError'
import { CheckoutStep3UserInfo } from '@/components/_shared/CheckoutStep3UserInfo'
import type { DonationFormInput } from '@/lib/validations/donation.validation'
import { DonationCheckoutStep3CampaignSelectionAndNotes } from './DonationCheckoutStep3CampaignSelectionAndNotes'
import { CampaignWithCount } from '@/types/campaign.types'
import { Step3DonationAmountSection } from './Step3DonationAmountSection'

type Props = {
  campaignName?: string | null
  campaigns: CampaignWithCount[]
  savedCards: PaymentMethod[]
  setStep: (step: number) => void
}

const MIN_DONATION = 5

export function PublicDonateCheckoutForm({ campaignName, campaigns, savedCards, setStep }: Props) {
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useFormContext<DonationFormInput>()

  // Stripe Elements owns card validity, so it stays out of the form
  const [cardComplete, setCardComplete] = useState(false)

  const values = watch()

  // ── Derived ───────────────────────────────────────────────────────────────
  const baseAmount = getDonateCheckoutAmount(values)

  // One rounded figure drives the display, the charge, and the metadata, so
  // what the donor is shown is exactly what they are billed
  const processingFee = Math.round(calculateStripeFees(baseAmount) * 100) / 100
  const feesCovered = values.coverFees ? processingFee : 0
  const finalAmount = Math.round((baseAmount + feesCovered) * 100)
  const finalAmountDisplay = (finalAmount / 100).toFixed(2)

  const usingSavedCard = Boolean(values.selectedCardId && !values.useNewCard)
  const fullName = `${values.firstName?.trim() ?? ''} ${values.lastName?.trim() ?? ''}`.trim()

  const hasName = Boolean(values.firstName || values.lastName)
  const hasAddress = Boolean(values.addressLine1)
  const meetsMinimum = baseAmount >= MIN_DONATION

  const derivedAddress = hasAddress
    ? {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        zipPostalCode: values.zipPostalCode
      }
    : null

  const isValid = (usingSavedCard || cardComplete) && hasName && hasAddress && meetsMinimum

  const setDefaultCard = useCallback(
    (value: string) => setValue('selectedCardId', value, { shouldDirty: true }),
    [setValue]
  )
  useDefaultCard(savedCards, setDefaultCard)

  // Preselect the campaign the visitor arrived from
  useEffect(() => {
    if (!campaignName) return

    const match = campaigns.find((campaign) => campaign.name === campaignName)
    if (match) setValue('campaignId', match.id)
  }, [campaignName, campaigns, setValue])

  // ── Submit ─────────────────────────────────────────────────────────────────
  const { submitDonation, isProcessing } = useDonationSubmit({
    finalAmount,
    feesCovered,
    usingSavedCard,
    fullName
  })

  const onSubmit = handleSubmit(submitDonation)

  return (
    <div className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900 mb-4 sm:mb-6">
        Make Your Donation
      </h2>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-y-8">
        {/* ── Donation type + amount ── */}
        <Step3DonationAmountSection />

        {/* ── User info ── */}
        <CheckoutStep3UserInfo address={derivedAddress} name={fullName} setStep={setStep} phone={values.phone} />

        {/* ── Campaign + notes ── */}
        <DonationCheckoutStep3CampaignSelectionAndNotes campaigns={campaigns} />

        {/* ── Payment ── */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
            Payment Method
          </legend>
          <div className="space-y-6">
            {savedCards.length > 0 && (
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

            {(savedCards.length === 0 || values.useNewCard) && <CardElementField onChange={setCardComplete} />}

            {/* Nothing to save when paying with a card already on file */}
            {!usingSavedCard && <SaveCardToggle />}

            <CoverFeesToggle processingFee={processingFee} />
          </div>
        </fieldset>

        {/* ── Error ── */}
        <FormError />

        {!meetsMinimum && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Donations start at ${MIN_DONATION}.</p>
        )}

        {meetsMinimum && (!hasName || !hasAddress) && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Add your {!hasName ? 'name' : 'mailing address'} above to continue.
          </p>
        )}

        <SubmitButton
          isSubmitting={isSubmitting || isProcessing}
          isValid={isValid}
          label={`Donate $${finalAmountDisplay}`}
        />

        <p className="text-xs dark:text-zinc-500 text-neutral-600 text-center">
          Secured by Stripe · Powered by{' '}
          <a className="sqysh-gradient hover:underline" href="https://sqysh.io?lead_source=bgcl">
            Sqysh
          </a>
        </p>
      </form>
    </div>
  )
}
