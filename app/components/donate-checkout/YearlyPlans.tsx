import { YEARLY_PLANS } from '@/app/lib/constants/donate.constants'
import { motion } from 'framer-motion'

const YearlyPlans = ({ setSelectedPlan, selectedPlan, amount, setAmount }) => {
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan.id)

    // Set amount for preset plans
    if (plan.id !== 'yearly-custom') {
      setAmount(plan.amount)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
        Select a yearly plan:
      </p>
      <div className="grid grid-cols-1 gap-3">
        {YEARLY_PLANS.map((plan) => (
          <div key={plan.id}>
            <button
              type="button"
              onClick={() => handlePlanSelect(plan)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedPlan === plan.id
                  ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-500/10'
                  : 'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold dark:text-white text-neutral-900">{plan.name}</p>
                  <p className="text-sm dark:text-zinc-400 text-neutral-600">{plan.description}</p>
                </div>
                {plan.id !== 'yearly-custom' && (
                  <p className="text-lg font-bold dark:text-sky-400 text-sky-600">${plan.amount}</p>
                )}
              </div>
            </button>

            {/* Custom amount input - only show when this plan is selected */}
            {plan.id === 'yearly-custom' && selectedPlan === 'yearly-custom' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-zinc-500 text-neutral-600">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
                    placeholder="Enter amount"
                    step="0.01"
                    min="5"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default YearlyPlans
