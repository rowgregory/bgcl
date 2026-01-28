import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const SubmitButton = ({ loading, coverFees, baseAmount, calculateFees, donationType, selectedPlan, email, name }) => {
  const isMonthlyValid = (donationType === 'monthly' || donationType === 'yearly') && selectedPlan
  const isValid = email && name && (donationType === 'once' || isMonthlyValid)

  return (
    <button
      type="submit"
      disabled={!isValid || loading}
      className="w-full px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:active:bg-sky-800 dark:disabled:bg-zinc-700 dark:text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
        />
      ) : (
        <Heart className="w-4 h-4" />
      )}
      <span>
        {loading
          ? 'Processing...'
          : (() => {
              const displayAmount = coverFees ? (baseAmount + calculateFees(baseAmount)).toFixed(2) : baseAmount
              const suffix = donationType !== 'once' ? `/${donationType === 'monthly' ? 'mo' : 'yr'}` : ''

              return `Donate $${displayAmount}${suffix}`
            })()}
      </span>
    </button>
  )
}

export default SubmitButton
