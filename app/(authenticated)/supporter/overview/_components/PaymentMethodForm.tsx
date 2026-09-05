'use client'

import { useState } from 'react'
import { CreditCard, X } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import { ToggleCard } from '@/components/_shared/ToggleCard'
import type { PaymentMethodFormInput } from '@/lib/validations/payment-method.validation'
import { usePaymentMethodModal } from '@/stores/drawers'
import FormError from '@/components/_shared/FormError'
import { CardElementField } from '@/app/(payment)/_components/CardElementField'

const labelCls = 'block text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5'
const fieldCls =
  'w-full px-2.5 py-2 text-[13px] bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all'

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

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Cardholder name
          </label>

          <input
            id="cardholderName"
            type="text"
            placeholder="Name on the card"
            autoComplete="cc-name"
            aria-invalid={!!errors.cardholderName}
            aria-describedby={errors.cardholderName ? 'cardholderName-error' : undefined}
            className={`w-full h-13 px-5 text-[15px] bg-transparent rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 ${
              errors.cardholderName ? 'border-red-400 dark:border-red-500' : 'border-neutral-200 dark:border-neutral-800'
            }`}
            {...register('cardholderName')}
          />

          {errors.cardholderName && (
            <p id="cardholderName-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.cardholderName.message}
            </p>
          )}
        </div>

        <CardElementField onChange={setCardComplete} />

        <FormError />

        {isFirstCard ? (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
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

        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          Card details go straight to Stripe. We never see or store them.
        </p>
      </div>

      <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 px-5 py-3 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-3 py-2 rounded text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !cardComplete}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          {isSubmitting ? 'Saving…' : 'Add card'}
        </button>
      </div>
    </div>
  )
}
