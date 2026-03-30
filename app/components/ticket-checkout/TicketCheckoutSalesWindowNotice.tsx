import Link from 'next/link'
import { TicketSalesCountdown } from './TicketSalesCountdown'
import { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { createPaymentMethod } from '@/app/lib/actions/createPaymentMethod'
import { CheckCircle2, CreditCard, Loader2, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export function TicketCheckoutSalesWindowNotice({ salesEnded, salesEndDate, salesStartDate, savedCards }) {
  const [addingCard, setAddingCard] = useState(false)
  const [savingCard, setSavingCard] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [cardSaved, setCardSaved] = useState(false)

  const handleSaveCard = async () => {
    if (!stripe || !elements) return
    setSavingCard(true)
    try {
      const card = elements.getElement(CardElement)
      if (!card) return
      const { paymentMethod, error } = await stripe.createPaymentMethod({ type: 'card', card })
      if (error || !paymentMethod) return
      await createPaymentMethod(paymentMethod.id)
      router.refresh()
      setAddingCard(false)
      setCardSaved(true) // ← flip success
    } catch {}
    setSavingCard(false)
  }

  return (
    <div
      className={`rounded-xl p-4 text-center border ${
        salesEnded
          ? 'dark:bg-red-500/10 bg-red-50 dark:border-red-500/20 border-red-200'
          : 'dark:bg-neutral-800/50 bg-neutral-100 dark:border-neutral-700 border-neutral-200'
      }`}
    >
      {salesEnded ? (
        <>
          <p className="text-sm font-bold dark:text-red-400 text-red-600 mb-1">Ticket Sales Have Closed</p>
          <p className="text-xs dark:text-neutral-500 text-neutral-500 mb-3">
            Sales ended on{' '}
            {new Date(salesEndDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-xs dark:text-neutral-500 text-neutral-500 mb-2">
            Thank you so much for your interest in supporting Boys &amp; Girls Club of Lynn.
          </p>
          <Link
            href="/donate"
            className="text-xs font-semibold dark:text-sky-400 text-sky-600 hover:underline underline-offset-2 transition-colors"
          >
            Make a donation instead →
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm font-bold dark:text-white text-neutral-900 mb-1">Tickets Go On Sale Soon</p>
          <p className="text-xs dark:text-neutral-500 text-neutral-500 mb-4">
            Sales open{' '}
            {new Date(salesStartDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>

          <TicketSalesCountdown target={salesStartDate} />

          <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-4 mb-3">
            {savedCards?.length > 0
              ? "Thanks for getting your cart ready early — you're all set to purchase the moment sales open!"
              : "Thanks for getting your cart ready early — add a payment method now so you're ready to go the moment sales open!"}
          </p>

          {/* Add card */}
          {savedCards?.length === 0 ? (
            <div className="mb-3">
              {addingCard ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-left space-y-3"
                >
                  <div className="px-3 py-3 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '14px',
                            color: 'var(--card-element-color, #374151)',
                            fontFamily: 'inherit',
                            '::placeholder': { color: '#9ca3af' }
                          },
                          invalid: { color: '#ef4444' }
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveCard}
                      disabled={savingCard}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {savingCard ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> Saving...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5" aria-hidden="true" /> Save Card
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setAddingCard(false)}
                      className="px-3 py-2 text-xs dark:text-neutral-500 text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-600 transition-colors border dark:border-neutral-700 border-neutral-200 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-[10px] dark:text-neutral-600 text-neutral-400 text-center">
                    Secured by Stripe — your card details are never stored on our servers.
                  </p>
                </motion.div>
              ) : (
                <button
                  onClick={() => setAddingCard(true)}
                  className="flex items-center justify-center gap-1.5 mx-auto text-xs font-semibold dark:text-sky-400 text-sky-600 hover:underline underline-offset-2 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
                  Add a payment method →
                </button>
              )}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs dark:text-emerald-400 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Card saved — you're ready for one-click checkout!
              </div>
              <Link
                href="/supporter/overview"
                className="flex items-center justify-center gap-1.5 mx-auto text-xs dark:text-neutral-500 text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-600 transition-colors"
              >
                <Settings className="w-3 h-3" aria-hidden="true" />
                Manage your payment methods →
              </Link>
            </motion.div>
          )}

          <Link
            href="/donate"
            className="text-xs font-semibold dark:text-sky-400 text-sky-600 hover:underline underline-offset-2 transition-colors"
          >
            Want to donate in the meantime? →
          </Link>
        </>
      )}
    </div>
  )
}
