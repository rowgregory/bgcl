'use client'

import { useState } from 'react'
import { CreditCard, X } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import { ToggleCard } from '@/components/_shared/ToggleCard'
import type { PaymentMethodFormInput } from '@/lib/validations/payment-method.validation'
import { usePaymentMethodModal } from '@/stores/drawers'
import FormError from '@/components/_shared/FormError'
import { CardElementField } from '@/app/(payment)/_components/CardElementField'

const dtCls = 'block text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600 mb-1.5'
const fieldCls =
  'w-full px-2.5 py-2 text-[13px] bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all'
const actionCls =
  'text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1'

export function PaymentMethodForm({ isFirstCard }: { isFirstCard: boolean }) {
  const {
    control,
    register,
    formState: { errors, isSubmitting }
  } = useFormContext<PaymentMethodFormInput>()

  const onClose = usePaymentMethodModal((s) => s.close)

  // Stripe Elements owns card validity, so it stays out of the form
  const [cardComplete, setCardComplete] = useState(false)

  return (
    <div className="flex max-h-[85vh] flex-col bg-white dark:bg-neutral-950">
      <div className="shrink-0 h-11 flex items-center justify-between gap-4 px-5 border-b border-neutral-200 dark:border-neutral-800">
        <h3 id="payment-method-modal-title" className="text-sm font-semibold text-neutral-900 dark:text-white">
          Add a card
        </h3>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors shrink-0"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <div>
          <label htmlFor="cardholderName" className={dtCls}>
            Cardholder name
          </label>

          <input
            id="cardholderName"
            type="text"
            placeholder="Name on the card"
            autoComplete="cc-name"
            aria-invalid={!!errors.cardholderName}
            className={fieldCls}
            {...register('cardholderName')}
          />

          {errors.cardholderName && (
            <p role="alert" className="mt-1 text-[11px] text-red-600 dark:text-red-400">
              {errors.cardholderName.message}
            </p>
          )}
        </div>

        <CardElementField onChange={setCardComplete} />

        <FormError />

        {isFirstCard ? (
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            This is your first card, so we will use it automatically at checkout.
          </p>
        ) : (
          <Controller
            name="isDefault"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ToggleCard
                checked={!!value}
                onChange={onChange}
                Icon={CreditCard}
                title="Set as default card"
                description="Used automatically at checkout"
              />
            )}
          />
        )}

        <p className="text-xs text-neutral-400 dark:text-neutral-600 pt-1">
          Card details go straight to Stripe. We never see or store them.
        </p>
      </div>

      <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 px-5 py-3 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white`}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !cardComplete}
          className={`${actionCls} text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300`}
        >
          {isSubmitting ? 'Saving…' : 'Add card'}
        </button>
      </div>
    </div>
  )
}
