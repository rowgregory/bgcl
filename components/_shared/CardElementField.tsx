'use client'

import { useId, useState } from 'react'
import { CardElement } from '@stripe/react-stripe-js'
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js'

import { usePreferencesStore } from '@/stores/usePreferencesStore'

type Props = {
  onChange: (complete: boolean) => void
}

export function CardElementField({ onChange }: Props) {
  const isDark = usePreferencesStore((s) => s.isDark)

  const labelId = useId()
  const errorId = useId()

  const [cardError, setCardError] = useState<string | null>(null)

  const handleChange = (event: StripeCardElementChangeEvent) => {
    setCardError(event.error?.message ?? null)
    onChange(event.complete)
  }

  return (
    <div>
      <label id={labelId} className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
        Card Details
      </label>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={cardError ? errorId : undefined}
        className="border-2 border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 focus-within:border-sky-500 dark:focus-within:border-sky-500 transition-colors"
      >
        <CardElement
          onChange={handleChange}
          options={{
            style: {
              base: {
                color: isDark ? '#ffffff' : '#171717',
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
      {cardError && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-500 dark:text-red-400">
          {cardError}
        </p>
      )}
    </div>
  )
}
