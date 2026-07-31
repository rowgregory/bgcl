import { IPaymentMethod } from '@/types/entities/payment-method'
import { ArrowLeft, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

type Props = {
  savedCards: IPaymentMethod[]
  selectedCardId: string | null
  useNewCard: boolean
  onSelectCard: (stripePaymentId: string) => void
  onUseNewCard: () => void
  onUseSavedCard: () => void
}

export function SavedCardSelector({
  savedCards,
  selectedCardId,
  useNewCard,
  onSelectCard,
  onUseNewCard,
  onUseSavedCard
}: Props) {
  if (!savedCards?.length) return null

  return (
    <div>
      <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-3">Payment Method</label>

      {!useNewCard ? (
        <div className="space-y-2">
          {savedCards.map((card) => {
            const isSelected = selectedCardId === card.stripePaymentId

            return (
              <motion.button
                key={card.stripePaymentId}
                type="button"
                onClick={() => onSelectCard(card.stripePaymentId)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2 px-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-500/10'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-current"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white capitalize">
                        {card.cardBrand} •••• {card.cardLast4}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {card.cardholderName} • Expires {String(card.cardExpMonth).padStart(2, '0')}/{card.cardExpYear}
                      </p>
                    </div>
                  </div>
                  {card.isDefault && (
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
              </motion.button>
            )
          })}

          <button
            type="button"
            onClick={onUseNewCard}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed dark:border-neutral-700 border-neutral-200 dark:hover:border-neutral-500 hover:border-neutral-300 dark:text-neutral-400 text-neutral-500 dark:hover:text-neutral-200 hover:text-neutral-700 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            Use a different card
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onUseSavedCard}
          className="inline-flex items-center gap-2 text-sm font-medium dark:text-neutral-400 text-neutral-500 dark:hover:text-neutral-200 hover:text-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:rounded"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          Use a saved card
        </button>
      )}
    </div>
  )
}
