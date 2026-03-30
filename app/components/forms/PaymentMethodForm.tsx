'use client'

import { useState } from 'react'
import { AlertCircle, CreditCard, Loader2, X } from 'lucide-react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { store } from '@/app/lib/store/store'
import { setInputs } from '@/app/lib/store/slices/formSlice'

interface PaymentMethodFormProps {
  inputs: {
    isDefault?: boolean
    cardholderName?: string
    error?: string
  }
  errors?: Record<string, string>
  isLoading?: boolean
  isUpdating?: boolean
  onClose: () => void
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}

export default function PaymentMethodForm({
  inputs,
  errors,
  isLoading,
  isUpdating,
  onClose,
  handleInput,
  handleSubmit
}: PaymentMethodFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [cardError, setCardError] = useState<string | null>(null)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCardError(null)
    if (!stripe || !elements) return

    try {
      handleSubmit(e)
    } catch (err: any) {
      setCardError(err?.message || 'Failed to add payment method')
    }
  }

  const isDark = document.documentElement.classList.contains('dark')

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col h-full dark:bg-neutral-950 bg-white">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900/50 bg-neutral-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold dark:text-white text-neutral-900">
              {isUpdating ? 'Edit Payment Method' : 'Add Payment Method'}
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
              name="cardholderName"
              value={inputs.cardholderName ?? ''}
              onChange={handleInput}
              placeholder="John Doe"
              autoComplete="cc-name"
              className="w-full px-4 py-2.5 rounded-xl border-2 dark:border-neutral-700/50 border-neutral-200 dark:bg-neutral-800/50 bg-neutral-100 dark:text-white text-neutral-900 dark:placeholder-neutral-500 placeholder-neutral-400 text-sm focus:outline-none focus:ring-0 focus:border-sky-500 dark:focus:border-sky-500 transition-all"
            />
            {errors?.cardholderName && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.cardholderName}</p>
            )}
          </div>

          {/* Card Details */}
          <div>
            <label className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider mb-2">
              Card Details
            </label>
            <div className="px-4 py-3 rounded-xl border-2 dark:border-neutral-700/50 border-neutral-200 dark:bg-neutral-800/50 bg-neutral-100 transition-all focus-within:border-sky-500 dark:focus-within:border-sky-500">
              <CardElement
                onChange={(e) =>
                  store.dispatch(
                    setInputs({
                      formName: 'paymentMethodForm',
                      data: { cardComplete: e.complete, error: e.error?.message ?? null }
                    })
                  )
                }
                options={{
                  style: {
                    base: {
                      color: isDark ? '#f5f5f5' : '#111827',
                      backgroundColor: 'transparent',
                      fontSize: '14px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      '::placeholder': { color: isDark ? '#525252' : '#a3a3a3' }
                    },
                    invalid: { color: '#ef4444' }
                  }
                }}
              />
            </div>
            {cardError && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{cardError}</p>}
          </div>

          {/* Error */}
          {inputs?.error && (
            <div
              className="flex items-start gap-2.5 p-3.5 rounded-xl dark:bg-red-500/10 dark:border-red-500/20 bg-red-50 border-red-200 border-2"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 dark:text-red-400 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm dark:text-red-300 text-red-700">{inputs.error}</p>
            </div>
          )}

          {/* Default Card Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={inputs.isDefault}
            onClick={() =>
              store.dispatch(setInputs({ formName: 'paymentMethodForm', data: { isDefault: !inputs?.isDefault } }))
            }
            className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl border-2 transition-all ${
              inputs.isDefault
                ? 'dark:bg-sky-500/10 dark:border-sky-500/50 bg-sky-500/10 border-sky-500/50'
                : 'dark:bg-neutral-800/50 dark:border-neutral-700/50 dark:hover:border-neutral-600/50 bg-neutral-100 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 text-left min-w-0">
              <CreditCard
                className={`w-4 h-4 shrink-0 transition-colors ${
                  inputs.isDefault ? 'dark:text-sky-400 text-sky-600' : 'dark:text-neutral-500 text-neutral-500'
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium truncate ${
                    inputs.isDefault ? 'dark:text-white text-neutral-900' : 'dark:text-neutral-300 text-neutral-700'
                  }`}
                >
                  Set as default card
                </p>
                <p className="text-xs dark:text-neutral-500 text-neutral-500 truncate">
                  Used automatically at checkout
                </p>
              </div>
            </div>
            {/* Switch Toggle */}
            <div
              className={`w-10 h-6 sm:w-12 sm:h-7 rounded-full relative shrink-0 border transition-colors ${
                inputs.isDefault
                  ? 'dark:bg-sky-500 dark:border-sky-500 bg-sky-600 border-sky-600'
                  : 'dark:bg-zinc-700 dark:border-zinc-600 bg-neutral-200 border-neutral-300'
              }`}
            >
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 -mt-px rounded-full absolute top-1 transition-all ${
                  inputs.isDefault
                    ? 'dark:bg-zinc-200 bg-white left-5 sm:left-6'
                    : 'dark:bg-zinc-600 bg-neutral-400 left-1'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900/50 bg-neutral-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium dark:text-neutral-400 text-neutral-500 dark:hover:text-white hover:text-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !inputs?.cardholderName}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-sky-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <CreditCard className="w-4 h-4" aria-hidden="true" />
            )}
            {isLoading ? 'Saving...' : isUpdating ? 'Save Changes' : 'Add Card'}
          </button>
        </div>
      </div>
    </form>
  )
}
