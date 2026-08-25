'use client'

import { useState } from 'react'
import { CreditCard, Info, Loader2, X } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import { CardElementField } from '@/components/_shared/CardElementField'
import { ToggleCard } from '@/components/_shared/ToggleCard'
import type { PaymentMethodFormInput } from '@/lib/validations/payment-method.validation'
import { usePaymentMethodModal } from '@/stores/drawers'
import FormError from '@/components/_shared/FormError'

export default function PaymentMethodForm({ isFirstCard }: { isFirstCard: boolean }) {
  const {
    control,
    register,
    formState: { errors, isSubmitting }
  } = useFormContext<PaymentMethodFormInput>()

  const onClose = usePaymentMethodModal((s) => s.close)

  // Stripe Elements owns card validity, so it stays out of the form
  const [cardComplete, setCardComplete] = useState(false)

  return (
    <div className="flex max-h-[85vh] flex-col dark:bg-neutral-950 bg-white">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900/50 bg-neutral-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="payment-method-modal-title" className="text-base font-bold dark:text-white text-neutral-900">
              Add Payment Method
            </h3>
            <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">
              We never store your full card details
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg dark:text-neutral-500 text-neutral-400 dark:hover:text-white hover:text-neutral-900 dark:hover:bg-neutral-800 hover:bg-neutral-100 transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Cardholder Name */}
          <div>
            <label
              htmlFor="cardholderName"
              className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider mb-2"
            >
              Cardholder Name
            </label>
            <input
              id="cardholderName"
              type="text"
              placeholder="John Doe"
              autoComplete="cc-name"
              aria-invalid={!!errors.cardholderName}
              className="w-full px-4 py-2.5 rounded-xl border-2 dark:border-neutral-700/50 border-neutral-200 dark:bg-neutral-800/50 bg-neutral-100 dark:text-white text-neutral-900 dark:placeholder-neutral-500 placeholder-neutral-400 text-sm focus:outline-none focus:ring-0 focus:border-sky-500 dark:focus:border-sky-500 transition-all"
              {...register('cardholderName')}
            />
            {errors.cardholderName && (
              <p role="alert" className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.cardholderName.message}
              </p>
            )}
          </div>

          {/* Card Details */}
          <CardElementField onChange={setCardComplete} />

          {/* Error */}
          <FormError />

          {/* Default Card */}
          {isFirstCard ? (
            <p className="flex items-start gap-2.5 text-xs dark:text-neutral-400 text-neutral-600">
              <Info className="w-4 h-4 shrink-0 mt-px dark:text-sky-400 text-sky-600" aria-hidden="true" />
              This is your first card, so we&apos;ll use it automatically at checkout.
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
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900/50 bg-neutral-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-sm font-medium dark:text-neutral-400 text-neutral-500 dark:hover:text-white hover:text-neutral-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !cardComplete}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-sky-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <CreditCard className="w-4 h-4" aria-hidden="true" />
            )}
            {isSubmitting ? 'Saving...' : 'Add Card'}
          </button>
        </div>
      </div>
    </div>
  )
}
