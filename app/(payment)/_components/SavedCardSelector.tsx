import { motion } from 'framer-motion'
import { PaymentMethod } from '@prisma/client'

type Props = {
  savedCards: PaymentMethod[]
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

  if (useNewCard) {
    return (
      <button
        type="button"
        onClick={onUseSavedCard}
        className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
      >
        Use a saved card instead
      </button>
    )
  }

  return (
    <div role="radiogroup" aria-label="Saved cards" className="space-y-2">
      {savedCards.map((card) => {
        const isSelected = selectedCardId === card.stripePaymentId

        return (
          <button
            key={card.stripePaymentId}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelectCard(card.stripePaymentId)}
            className={`w-full flex items-center justify-between gap-4 px-5 py-4 rounded-lg border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              isSelected
                ? 'border-sky-600 bg-sky-50 dark:bg-sky-500/10'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
            }`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span
                aria-hidden="true"
                className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-sky-600' : 'border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-sky-600"
                  />
                )}
              </span>

              <span className="min-w-0">
                <span
                  className={`block text-[15px] font-medium capitalize tabular-nums ${
                    isSelected ? 'text-sky-900 dark:text-sky-100' : 'text-neutral-900 dark:text-white'
                  }`}
                >
                  {card.cardBrand} ···· {card.cardLast4}
                </span>

                <span
                  className={`block text-sm mt-0.5 tabular-nums ${
                    isSelected ? 'text-sky-700 dark:text-sky-300' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  Expires {String(card.cardExpMonth).padStart(2, '0')}/{String(card.cardExpYear).slice(-2)}
                </span>
              </span>
            </span>

            {card.isDefault && (
              <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-600 shrink-0">
                Default
              </span>
            )}
          </button>
        )
      })}

      <button
        type="button"
        onClick={onUseNewCard}
        className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1 pt-2"
      >
        Use a different card
      </button>
    </div>
  )
}
