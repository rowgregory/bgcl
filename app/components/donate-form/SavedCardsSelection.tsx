import { motion } from 'framer-motion'

const SavedCardsSelection = ({ savedCards, setSelectedCardId, selectedCardId, setUseNewCard, useNewCard }) => {
  return (
    <div className="mb-8">
      <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
        Saved Cards
      </label>

      <div className="space-y-2">
        {savedCards.map((card) => (
          <motion.button
            key={card.stripePaymentId}
            type="button"
            onClick={() => setSelectedCardId(card.stripePaymentId)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedCardId === card.stripePaymentId
                ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-500/10'
                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  {selectedCardId === card.stripePaymentId && (
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
        ))}
      </div>

      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3">
        Or{' '}
        <button
          type="button"
          onClick={() => {
            setSelectedCardId(null)
            setUseNewCard(!useNewCard)
          }}
          className="font-semibold text-sky-600 dark:text-sky-400 hover:underline"
        >
          use a new card
        </button>
      </p>
    </div>
  )
}

export default SavedCardsSelection
