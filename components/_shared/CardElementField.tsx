import { setInputs } from '@/lib/store/slices/formSlice'
import { store, useApplicationSelector } from '@/lib/store/store'
import { CardElement } from '@stripe/react-stripe-js'

type Props = {
  formName: string
}

export function CardElementField({ formName }: Props) {
  const { isDark } = useApplicationSelector()

  return (
    <div>
      <label id="card-label" className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
        Card Details
      </label>
      <div
        role="group"
        aria-labelledby="card-label"
        className="border-2 border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 focus-within:border-sky-500 dark:focus-within:border-sky-500 transition-colors"
      >
        <CardElement
          onChange={(e) =>
            store.dispatch(
              setInputs({
                formName,
                data: { cardComplete: e.complete, error: e.error?.message ?? null }
              })
            )
          }
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
    </div>
  )
}
