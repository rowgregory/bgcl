'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

interface PaymentMethodFormProps {
  inputs: {
    isDefault?: boolean
    cardholderName?: string
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
    <form onSubmit={handleFormSubmit} className="flex flex-col h-full bg-white dark:bg-neutral-950">
      {/* Top Bar */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-neutral-900 dark:text-white font-black text-base">Add Payment Method</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs mt-1">
              Enter your card information securely. We never store your full card details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-950">
        <div className="max-w-5xl mx-auto p-8">
          <div className="mb-8">
            <label
              htmlFor="cardholderName"
              className="block text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide"
            >
              Cardholder Name
            </label>

            <input
              id="cardholderName"
              type="text"
              name="cardholderName"
              value={inputs.cardholderName}
              onChange={handleInput}
              placeholder="John Doe"
              className="w-full border-2 border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-sky-500 dark:focus:border-sky-500 focus:outline-none transition-colors font-semibold text-base"
            />

            {errors?.cardholderName && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium">{errors.cardholderName}</p>
            )}
          </div>

          {/* Card Information */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
              Card Information
            </label>

            <div className="border-2 border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
              <CardElement
                options={{
                  style: {
                    base: {
                      color: isDark ? '#f5f5f5' : '#111827',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      '::placeholder': { color: isDark ? '#6b7280' : '#9ca3af' }
                    },
                    invalid: { color: '#ef4444' }
                  }
                }}
              />
            </div>
            {cardError && <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium">{cardError}</p>}
          </div>

          {/* Default Card Preference */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
              Preferences
            </label>

            <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={!!inputs.isDefault}
                onChange={handleInput}
                className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-600 text-sky-600 dark:text-sky-500 focus:ring-sky-500 dark:focus:ring-sky-400 cursor-pointer"
              />
              <label
                htmlFor="isDefault"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer flex-1"
              >
                Set as default payment method
              </label>
            </div>

            {errors?.isDefault && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium">{errors.isDefault}</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-8 py-4">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className="px-6 py-2 text-sm font-semibold bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-700 disabled:bg-sky-600/50 dark:disabled:bg-sky-600/30 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isUpdating ? 'Save Changes' : 'Add Payment Method'}
          </button>
        </div>
      </div>
    </form>
  )
}
