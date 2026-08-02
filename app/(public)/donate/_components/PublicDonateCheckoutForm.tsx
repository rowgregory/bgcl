import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { calculateStripeFees } from '@/lib/utils/calculateStripeFees'
import { useDefaultCard } from '@/lib/hooks/useDefaultCard'
import { useInitializeForm } from '@/lib/hooks/useInitializeForm'
import { SavedCardSelector } from '@/components/_shared/SavedCardSelector'
import { CardElementField } from '@/components/_shared/CardElementField'
import { SaveCardToggle } from '@/components/_shared/SaveCardToggle'
import { CoverFeesToggle } from '@/components/_shared/CoverFeesToggle'
import { SubmitButton } from '@/components/ui/buttons/SubmitButton'
import { FormError } from '@/components/_shared/FormError'
import { setDonateCheckoutForm as setForm } from '@/lib/utils/setDonateCheckoutForm'
import { getDonateCheckoutAmount } from '@/lib/utils/getDonateCheckoutAmount'
import { useDonationSubmit } from '@/lib/hooks/useDonationSubmit'
import { CheckoutStep3UserInfo } from '@/components/_shared/CheckoutStep3UserInfo'
import { DonationCheckoutStep3CampaignSelectionAndNotes } from './DonationCheckoutStep3CampaignSelectionAndNotes'
import { useCampaignInit } from '@/lib/hooks/useCampaignInit'
import { Step3DonationAmountSection } from '@/app/(public)/donate/_components/Step3DonationAmountSection'

export function PublicDonateCheckoutForm({ campaignName, campaigns, savedCards, inputs, setStep }) {
  // ── Store ─────────────────────────────────────────────────────────────────
  const session = useSession()
  const isAuthed = session.status === 'authenticated'

  // ── Derived ───────────────────────────────────────────────────────────────
  const baseAmount = getDonateCheckoutAmount(inputs)
  const processingFee = Math.round(calculateStripeFees(baseAmount) * 100) / 100
  const finalAmount = Math.round((inputs?.coverFees ? baseAmount + calculateStripeFees(baseAmount) : baseAmount) * 100)
  const finalAmountDisplay = (finalAmount / 100).toFixed(2)
  const feesCovered = inputs?.coverFees ? calculateStripeFees(baseAmount) : 0
  const usingSavedCard = !!(inputs?.selectedCardId && !inputs?.useNewCard)
  const fullName = `${inputs?.firstName?.trim() ?? ''} ${inputs?.lastName?.trim() ?? ''}`.trim()
  const phone = inputs.phone

  const derivedName =
    inputs?.firstName || inputs?.lastName ? { firstName: inputs.firstName, lastName: inputs.lastName } : null

  const derivedAddress = inputs?.addressLine1
    ? {
        addressLine1: inputs.addressLine1,
        addressLine2: inputs.addressLine2,
        city: inputs.city,
        state: inputs.state,
        zipPostalCode: inputs.zipPostalCode
      }
    : null

  const isValid = (usingSavedCard ? true : inputs?.cardComplete) && !!derivedName && !!derivedAddress

  const setDefaultCard = useCallback((value: string) => setForm({ selectedCardId: value }), [])

  useDefaultCard(savedCards, setDefaultCard)
  useInitializeForm({ savedCards, ...{ selectedPlan: 'once_friend', amount: 50, donationType: 'once' } })
  useCampaignInit(campaignName, campaigns)

  // ── Submit ─────────────────────────────────────────────────────────────────
  const { handleSubmit } = useDonationSubmit({ inputs, finalAmount, feesCovered, usingSavedCard, fullName })

  return (
    <div className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900 mb-4 sm:mb-6">
        Make Your Donation
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-8">
        {/* ── Donation type + amount ── */}
        <Step3DonationAmountSection inputs={inputs} />

        {/* ── User info ── */}
        <CheckoutStep3UserInfo address={derivedAddress} name={fullName} setStep={setStep} phone={phone} />

        {/* ── Campaign + notes ── */}
        <DonationCheckoutStep3CampaignSelectionAndNotes
          campaign={inputs?.campaign}
          campaigns={campaigns}
          notes={inputs?.notes}
          setCampaign={(value) => setForm({ campaign: value })}
          setNotes={(value) => setForm({ notes: value })}
        />

        {/* ── Payment ── */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
            Payment Method
          </legend>
          <div className="space-y-6">
            {isAuthed && (
              <SavedCardSelector
                savedCards={savedCards}
                selectedCardId={inputs?.selectedCardId}
                useNewCard={inputs?.useNewCard}
                onSelectCard={(id) => setForm({ selectedCardId: id })}
                onUseNewCard={() => setForm({ useNewCard: true, selectedCardId: null })}
                onUseSavedCard={() =>
                  setForm({
                    useNewCard: false,
                    selectedCardId: savedCards[0]?.stripePaymentId ?? null,
                    saveCard: false
                  })
                }
              />
            )}

            {(!isAuthed || savedCards.length === 0 || inputs?.useNewCard) && (
              <CardElementField formName="donateCheckoutForm" />
            )}

            <SaveCardToggle formName="donateCheckoutForm" />
            <CoverFeesToggle formName="donateCheckoutForm" processingFee={processingFee} />
          </div>
        </fieldset>

        {/* ── Error ── */}
        <FormError formName="donateCheckoutForm" />

        <SubmitButton formName="donateCheckoutForm" isValid={isValid} label={`Donate $${finalAmountDisplay}`} />

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
