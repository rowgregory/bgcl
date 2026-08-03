import { useCallback, useEffect, useState } from 'react'
import { store } from '@/lib/store/store'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { IPaymentMethod } from '@/types/entities/payment-method'
import { calculateStripeFees } from '@/lib/utils/calculateStripeFees'
import { useDefaultCard } from '@/lib/hooks/useDefaultCard'
import { CardElementField } from '@/components/_shared/CardElementField'
import { useInitializeForm } from '@/lib/hooks/useInitializeForm'
import { SavedCardSelector } from '@/components/_shared/SavedCardSelector'
import { CoverFeesToggle } from '@/components/_shared/CoverFeesToggle'
import { SaveCardToggle } from '@/components/_shared/SaveCardToggle'
import { SubmitButton } from '@/components/ui/buttons/SubmitButton'
import { FormError } from '@/components/_shared/FormError'
import { setTicketCheckoutForm as setForm } from '@/lib/utils/setTicketCheckoutForm'
import { CheckoutStep3UserInfo } from '@/components/_shared/CheckoutStep3UserInfo'
import { useTicketCheckoutSubmit } from '@/lib/hooks/useTicketCheckoutSubmit'
import { setHideConfetti, setShowConfetti } from '@/lib/store/slices/uiSlice'
import { TicketCheckoutSalesWindowNotice } from './TicketCheckoutSalesWindowNotice'
import CustomSwitch from '@/components/_shared/CustomSwitch'
import { setInputs } from '@/lib/store/slices/formSlice'
import { useCartStore } from '@/stores/useCartStore'

interface ICheckoutForm {
  savedCards: IPaymentMethod[]
  inputs: any
  setStep: any
}

export function TicketCheckoutForm({ savedCards, inputs, setStep }: ICheckoutForm) {
  const items = useCartStore((s) => s.items)
  const session = useSession()
  const isAuthed = session.status === 'authenticated'

  const setDefaultCard = useCallback((value: string) => setForm({ selectedCardId: value }), [])
  useDefaultCard(savedCards, setDefaultCard)
  useInitializeForm({ savedCards })

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const processingFee = Math.round(calculateStripeFees(totalPrice) * 100) / 100
  const finalAmount = inputs?.coverFees ? totalPrice + processingFee : totalPrice
  const amountInCents = Math.round(finalAmount * 100)
  const usingSavedCard = !!(inputs?.selectedCardId && !inputs?.useNewCard)
  const fullName = `${inputs?.firstName?.trim() ?? ''} ${inputs?.lastName?.trim() ?? ''}`.trim()
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

  const finalAmountDisplay = (amountInCents / 100).toFixed(2)

  const { handleSubmit } = useTicketCheckoutSubmit({ inputs, amountInCents, processingFee, usingSavedCard, fullName })

  const salesStartDate = items[0]?.ticketSalesStartDate
  const salesEndDate = items[0]?.ticketSalesEndDate
  const now = new Date()

  const [salesStarted, setSalesStarted] = useState(!salesStartDate || new Date(salesStartDate) <= now)

  const salesEnded = salesEndDate && new Date(salesEndDate) < now

  useEffect(() => {
    if (salesStarted) return
    const id = setInterval(() => {
      if (new Date(salesStartDate) <= new Date()) {
        store.dispatch(setShowConfetti())
        setTimeout(() => store.dispatch(setHideConfetti(), 2000))
        setSalesStarted(true)
        clearInterval(id)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [salesStartDate, salesStarted])

  const isValid =
    salesStarted && !salesEnded && (usingSavedCard ? true : inputs?.cardComplete) && !!derivedName && !!derivedAddress

  const showPaymentSection = salesStarted && !salesEnded && !!derivedName && !!derivedAddress

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4 sm:p-6 md:p-8 shadow-sm"
    >
      <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900 mb-4 sm:mb-6">Payment Details</h2>
      <div className="flex-1">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-y-12">
          {/* ── Contact ── */}
          <CheckoutStep3UserInfo address={derivedAddress} name={fullName} setStep={setStep} />

          <CustomSwitch
            checked={inputs?.attendingEvent ?? true}
            label="I will be attending the event"
            description="Let us know if you plan to join us on the night"
            onChange={(val) =>
              store.dispatch(setInputs({ formName: 'ticketCheckoutForm', data: { attendingEvent: val } }))
            }
          />

          {/* ── Payment ── */}
          {showPaymentSection && (
            <fieldset className="border-0 p-0 m-0">
              <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
                Payment Method
              </legend>
              <div className="space-y-6">
                {/* ── Saved cards ── */}
                {isAuthed && (
                  <SavedCardSelector
                    savedCards={savedCards}
                    selectedCardId={inputs?.selectedCardId}
                    useNewCard={inputs?.useNewCard}
                    onSelectCard={(id) => setForm({ selectedCardId: id })}
                    onUseNewCard={() => setForm({ useNewCard: true, selectedCardId: null })}
                    onUseSavedCard={() =>
                      setForm({ useNewCard: false, selectedCardId: savedCards[0]?.stripePaymentId ?? null })
                    }
                  />
                )}

                {(!isAuthed || savedCards.length === 0 || inputs?.useNewCard) && (
                  <CardElementField formName="ticketCheckoutForm" />
                )}

                {/* ── Error ── */}
                <FormError formName="ticketCheckoutForm" />

                {/* ── Save card ── */}
                <SaveCardToggle formName="ticketCheckoutForm" />

                {/* ── Cover fees ── */}
                <CoverFeesToggle formName="ticketCheckoutForm" processingFee={processingFee} />
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

          {/* ── Submit ── */}
          <SubmitButton formName="ticketCheckoutForm" isValid={isValid} label={`Pay $${finalAmountDisplay}`} />
        </form>
      </div>
    </motion.div>
  )
}
