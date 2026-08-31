'use client'

import { motion } from 'framer-motion'

type Plan = {
  id: string
  name: string
  description: string
  amount?: number
}

type Props = {
  plans: Plan[]
  customId: string
  label: string
  suffix?: string
  selectedPlan: string
  setSelectedPlan: (id: string) => void
  amount: number
  setAmount: (amount: number) => void
}

export function DonateAmountSelector({
  plans,
  customId,
  label,
  suffix,
  selectedPlan,
  setSelectedPlan,
  amount,
  setAmount
}: Props) {
  const handleSelect = (plan: Plan) => {
    setSelectedPlan(plan.id)

    if (plan.id !== customId && plan.amount != null) {
      setAmount(plan.amount)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{label}</p>

      <div role="radiogroup" aria-label={label} className="space-y-2">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          const isCustom = plan.id === customId

          return (
            <div key={plan.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(plan)}
                className={`w-full flex items-center justify-between gap-4 px-5 py-4 rounded-lg border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50 dark:bg-sky-500/10'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <span className="min-w-0">
                  <span
                    className={`block text-base font-semibold ${
                      isSelected ? 'text-sky-900 dark:text-sky-100' : 'text-neutral-900 dark:text-white'
                    }`}
                  >
                    {plan.name}
                  </span>
                  <span
                    className={`block text-sm mt-0.5 ${
                      isSelected ? 'text-sky-700 dark:text-sky-300' : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {plan.description}
                  </span>
                </span>

                {!isCustom && (
                  <span
                    className={`shrink-0 tabular-nums ${
                      isSelected ? 'text-sky-600 dark:text-sky-400' : 'text-neutral-400 dark:text-neutral-600'
                    }`}
                  >
                    <span className="text-2xl font-semibold">${plan.amount}</span>
                    {suffix && <span className="text-sm">{suffix}</span>}
                  </span>
                )}
              </button>

              {isCustom && isSelected && (
                <div className="relative mt-2">
                  <span
                    aria-hidden="true"
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-neutral-400 dark:text-neutral-600 tabular-nums"
                  >
                    $
                  </span>

                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    aria-label={`Custom amount${suffix ? ` ${suffix}` : ''}`}
                    placeholder="0"
                    step="0.01"
                    min="5"
                    autoFocus
                    className={`w-full pl-12 py-4 text-2xl font-semibold tabular-nums bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      suffix ? 'pr-14' : 'pr-5'
                    }`}
                  />

                  {suffix && (
                    <span
                      aria-hidden="true"
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 dark:text-neutral-600"
                    >
                      {suffix}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
