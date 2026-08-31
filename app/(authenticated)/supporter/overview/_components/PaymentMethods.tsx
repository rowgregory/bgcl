import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { deletePaymentMethod } from '@/lib/actions/stripe/deletePaymentMethod'
import { setDefaultPaymentMethod } from '@/lib/actions/stripe/setDefaultPaymentMethod'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'
import { InlineMessage, InlineMessageState } from '@/components/_shared/InlineMessage'
import { usePaymentMethodModal } from '@/stores/drawers'
import { PaymentMethodModal } from './PaymentMethodModal'

const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600'
const actionCls =
  'text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1'

export function PaymentMethods({ savedCards }) {
  const router = useRouter()

  const [deleting, setDeleting] = useState<string | null>(null)
  const [settingDefault, setSettingDefault] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [message, setMessage] = useState<InlineMessageState | null>(null)

  const open = usePaymentMethodModal((s) => s.open)
  const cards = savedCards ?? []

  const handleSetDefault = async (cardId: string) => {
    setMessage(null)
    setSettingDefault(cardId)

    try {
      const result = await setDefaultPaymentMethod(cardId)

      if (!result?.success) {
        setMessage({
          type: 'error',
          message: 'Could not update your default card',
          description: extractErrorMessage(result)
        })
        return
      }

      router.refresh()
    } catch (error) {
      setMessage({
        type: 'error',
        message: 'Could not update your default card',
        description: extractErrorMessage(error)
      })
    } finally {
      setSettingDefault(null)
    }
  }

  const handleDelete = async (stripePaymentId: string) => {
    setMessage(null)
    setDeleting(stripePaymentId)

    try {
      const res = await deletePaymentMethod(stripePaymentId)

      if (!res.success) {
        setMessage({ type: 'error', message: 'Could not remove card', description: res.error })
        return
      }

      router.refresh()
    } catch {
      setMessage({
        type: 'error',
        message: 'Could not remove card',
        description: 'Something went wrong. Please try again.'
      })
    } finally {
      setDeleting(null)
      setConfirming(null)
    }
  }

  return (
    <>
      <PaymentMethodModal savedCards={savedCards} />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className={labelCls}>Payment methods</h2>

          <button
            type="button"
            onClick={() => open()}
            aria-label="Add new payment method"
            className={`${actionCls} text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300`}
          >
            Add card
          </button>
        </div>

        <InlineMessage state={message} onDismiss={() => setMessage(null)} className="mb-3" />

        {cards.length === 0 ? (
          <p className="text-[13px] text-neutral-400 dark:text-neutral-600 py-2">
            No saved cards. You can save one at checkout for faster payments.
          </p>
        ) : (
          <ul
            role="list"
            aria-label="Saved payment methods"
            className="divide-y divide-neutral-100 dark:divide-neutral-900 list-none p-0 m-0"
          >
            {cards.map((card) => {
              const isBusy = settingDefault === card.id || deleting === card.id
              const isConfirming = confirming === card.id
              const cardLabel = `${card.cardBrand} ending in ${card.cardLast4}`

              return (
                <li key={card.id} className="py-3 first:pt-0 flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-2.5 min-w-0">
                    <span className="text-[13px] text-neutral-900 dark:text-white capitalize">{card.cardBrand}</span>

                    <span className="text-[13px] text-neutral-500 dark:text-neutral-400 tabular-nums">
                      ···· {card.cardLast4}
                    </span>

                    <span className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                      exp {String(card.cardExpMonth).padStart(2, '0')}/{String(card.cardExpYear).slice(-2)}
                    </span>

                    {card.isDefault && (
                      <span className="text-[11px] uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        Default
                      </span>
                    )}
                  </div>

                  {isConfirming ? (
                    <div className="flex items-center gap-4 shrink-0">
                      <span role="alert" className="text-xs text-neutral-500 dark:text-neutral-400">
                        Remove this card?
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDelete(card.id)}
                        disabled={isBusy}
                        autoFocus
                        aria-label={`Confirm removing ${cardLabel}`}
                        className={`${actionCls} text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300`}
                      >
                        {deleting === card.id ? 'Removing…' : 'Remove'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirming(null)}
                        disabled={isBusy}
                        className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 shrink-0">
                      {!card.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(card.id)}
                          disabled={isBusy}
                          aria-label={`Set ${cardLabel} as default`}
                          className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white`}
                        >
                          {settingDefault === card.id ? 'Saving…' : 'Set default'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setTimeout(() => setConfirming(card.id), 0)}
                        disabled={isBusy}
                        aria-label={`Remove ${cardLabel}`}
                        className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-red-600 dark:hover:text-red-400`}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </motion.div>
    </>
  )
}
