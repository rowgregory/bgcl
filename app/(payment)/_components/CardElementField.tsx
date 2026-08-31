'use client'

import { useId, useState } from 'react'
import { CardElement } from '@stripe/react-stripe-js'
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js'

import { usePreferencesStore } from '@/stores/usePreferencesStore'

export function CardElementField({ onChange }: { onChange: (complete: boolean) => void }) {
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
      <label id={labelId} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        Card details
      </label>

      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={cardError ? errorId : undefined}
        className={`px-5 py-4 rounded-lg border transition-colors focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-transparent ${
          cardError ? 'border-red-400 dark:border-red-500' : 'border-neutral-200 dark:border-neutral-800'
        }`}
      >
        <CardElement
          onChange={handleChange}
          options={{
            style: {
              base: {
                color: isDark ? '#ffffff' : '#171717',
                backgroundColor: 'transparent',
                fontSize: '15px',
                fontFamily: 'inherit',
                '::placeholder': { color: isDark ? '#525252' : '#a3a3a3' }
              },
              invalid: { color: '#dc2626' }
            }
          }}
        />
      </div>

      {cardError && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {cardError}
        </p>
      )}
    </div>
  )
}
