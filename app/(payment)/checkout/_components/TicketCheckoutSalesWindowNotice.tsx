import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { createPaymentMethod } from '@/lib/actions/stripe/createPaymentMethod'
import { usePreferencesStore } from '@/stores/usePreferencesStore'
import { TicketCheckoutSalesCountdown } from './TicketCheckoutSalesCountdown'

const fmtDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York'
  })

const linkCls =
  'text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded'

export function TicketCheckoutSalesWindowNotice({ salesEnded, salesEndDate, salesStartDate, savedCards }) {
  const [addingCard, setAddingCard] = useState(false)
  const [savingCard, setSavingCard] = useState(false)
  const [error, setError] = useState('')

  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const isDark = usePreferencesStore((s) => s.isDark)

  const hasCard = savedCards?.length > 0

  const handleSaveCard = async () => {
    if (!stripe || !elements) return

    const card = elements.getElement(CardElement)
    if (!card) return

    setSavingCard(true)
    setError('')

    try {
      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({ type: 'card', card })

      if (stripeError || !paymentMethod) {
        setError(stripeError?.message ?? 'We could not save that card. Please check the details.')
        return
      }

      const result = await createPaymentMethod(paymentMethod.id)

      if (result && result.success === false) {
        setError(result.error ?? 'We could not save that card. Please try again.')
        return
      }

      router.refresh()
      setAddingCard(false)
    } catch {
      setError('We could not save that card. Please try again.')
    } finally {
      setSavingCard(false)
    }
  }

  if (salesEnded) {
    return (
      <div className="py-6 border-y border-neutral-200 dark:border-neutral-800">
        <p className="text-base font-medium text-neutral-900 dark:text-white">Ticket sales have closed</p>

        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Sales ended on {fmtDate(salesEndDate)}. Thank you for your interest in supporting the club.
        </p>

        <Link href="/donate" className={`${linkCls} inline-block mt-4`}>
          Make a donation instead
        </Link>
      </div>
    )
  }

  return (
    <div className="py-6 border-b border-neutral-200 dark:border-neutral-800">
      <p className="text-base font-medium text-neutral-900 dark:text-white">Tickets go on sale soon</p>

      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Sales open {fmtDate(salesStartDate)}</p>

      <div className="mt-5">
        <TicketCheckoutSalesCountdown target={salesStartDate} />
      </div>

      <p className="mt-5 text-sm text-neutral-500 dark:text-neutral-400">
        {hasCard
          ? 'Your cart is ready and you have a card on file, so you can check out the moment sales open.'
          : 'Your cart is ready. Add a card now and you can check out the moment sales open.'}
      </p>

      {hasCard ? (
        <Link href="/supporter/overview" className={`${linkCls} inline-block mt-4`}>
          Manage your payment methods
        </Link>
      ) : addingCard ? (
        <div className="mt-4 space-y-3">
          <div className="px-5 py-4 rounded-lg border border-neutral-200 dark:border-neutral-800 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-transparent transition-colors">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '15px',
                    color: isDark ? '#ffffff' : '#171717',
                    backgroundColor: 'transparent',
                    fontFamily: 'inherit',
                    '::placeholder': { color: isDark ? '#525252' : '#a3a3a3' }
                  },
                  invalid: { color: '#dc2626' }
                }
              }}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSaveCard}
              disabled={savingCard}
              className={`${linkCls} disabled:opacity-50 disabled:cursor-not-allowed px-1`}
            >
              {savingCard ? 'Saving…' : 'Save card'}
            </button>

            <button
              type="button"
              onClick={() => {
                setAddingCard(false)
                setError('')
              }}
              disabled={savingCard}
              className="text-sm font-medium text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 px-1"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            Card details go straight to Stripe. We never see or store them.
          </p>
        </div>
      ) : (
        <button type="button" onClick={() => setAddingCard(true)} className={`${linkCls} block mt-4 px-1`}>
          Add a payment method
        </button>
      )}

      <Link
        href="/donate"
        className="block mt-5 text-sm text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        Want to donate in the meantime?
      </Link>
    </div>
  )
}
