import { deletePaymentMethod } from '@/lib/actions/stripe/deletePaymentMethod'
import { setDefaultPaymentMethod } from '@/lib/actions/stripe/setDefaultPaymentMethod'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Loader2, Plus, Trash2 } from 'lucide-react'
import { InlineMessage, InlineMessageState } from '@/components/_shared/InlineMessage'
import { usePaymentMethodModal } from '@/stores/drawers'

export function PaymentMethods({ savedCards }) {
  const router = useRouter()
  const [deletingPaymentMethod, setDeletingPaymentMethod] = useState<string | null>(null)
  const [settingDefault, setSettingDefault] = useState<string | null>(null)
  const [message, setMessage] = useState<InlineMessageState | null>(null)
  const open = usePaymentMethodModal((s) => s.open)

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

      setMessage({
        type: 'success',
        message: 'Default payment method updated',
        description: 'Your default card has been changed successfully.'
      })
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

  async function handleDeletePaymentMethod(stripePaymentId: string) {
    setMessage(null)
    setDeletingPaymentMethod(stripePaymentId)

    try {
      const res = await deletePaymentMethod(stripePaymentId)

      if (res?.error) {
        setMessage({
          type: 'error',
          message: 'Could not remove card',
          description: extractErrorMessage(res)
        })
        return
      }

      router.refresh()

      setMessage({
        type: 'success',
        message: 'Card removed',
        description: 'Your saved card has been permanently removed.'
      })
    } catch (error) {
      setMessage({
        type: 'error',
        message: 'Could not remove card',
        description: extractErrorMessage(error)
      })
    } finally {
      setDeletingPaymentMethod(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold dark:text-white text-neutral-900">Payment Methods</h2>
          <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">Saved cards for one-click checkout</p>
        </div>
        <button
          onClick={() => open()}
          className="flex items-center gap-1.5 text-xs font-medium dark:text-sky-400 text-sky-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:rounded"
          aria-label="Add new payment method"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Add Card
        </button>
      </div>

      <InlineMessage state={message} onDismiss={() => setMessage(null)} className="mb-3" />

      {savedCards && savedCards.length > 0 ? (
        <ul role="list" aria-label="Saved payment methods" className="space-y-2">
          {savedCards.map((card) => (
            <li
              key={card.id}
              className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl px-4 py-3 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="shrink-0 w-9 h-6 rounded dark:bg-neutral-800 bg-white border dark:border-neutral-700 border-neutral-200 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <CreditCard className="w-4 h-4 dark:text-neutral-400 text-neutral-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium dark:text-white text-neutral-900 capitalize">
                    {card.cardBrand}&nbsp;
                    <span className="font-mono tracking-widest">••••&nbsp;{card.cardLast4}</span>
                  </p>
                  <p className="text-xs dark:text-neutral-500 text-neutral-400 mt-0.5">
                    Expires {String(card.cardExpMonth).padStart(2, '0')}/{card.cardExpYear}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {card.isDefault ? (
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20 bg-sky-50 text-sky-700 border-sky-200 border"
                    aria-label="Default payment method"
                  >
                    Default
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    disabled={settingDefault === card.id || deletingPaymentMethod === card.id}
                    className="text-[10px] font-medium dark:text-neutral-500 text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-600 transition-colors disabled:opacity-50"
                    aria-label={`Set ${card.cardBrand} ending in ${card.cardLast4} as default`}
                  >
                    {settingDefault === card.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                    ) : (
                      'Set default'
                    )}
                  </button>
                )}

                <div className="w-px h-3 dark:bg-neutral-700 bg-neutral-300" aria-hidden="true" />

                <button
                  onClick={() => handleDeletePaymentMethod(card.id)}
                  disabled={deletingPaymentMethod === card.id || settingDefault === card.id}
                  className="flex items-center gap-1 text-xs font-medium text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  aria-label={`Remove ${card.cardBrand} ending in ${card.cardLast4}`}
                >
                  {deletingPaymentMethod === card.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="w-3 h-3" aria-hidden="true" />
                  )}
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="dark:bg-neutral-900/50 dark:border-neutral-800 dark:border-dashed bg-neutral-50 border-neutral-200 border border-dashed rounded-xl px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          role="status"
          aria-label="No saved payment methods"
        >
          <div className="flex items-center gap-3">
            <div
              className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
              aria-hidden="true"
            >
              <CreditCard className="w-3.5 h-3.5 dark:text-neutral-500 text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-semibold dark:text-neutral-300 text-neutral-700">No saved cards</p>
              <p className="text-xs dark:text-neutral-500 text-neutral-400 mt-0.5">
                Save a card at checkout for faster payments
              </p>
            </div>
          </div>
          <button
            onClick={() => open()}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add Card
          </button>
        </div>
      )}
    </motion.div>
  )
}
