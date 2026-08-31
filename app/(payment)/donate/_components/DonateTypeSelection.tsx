'use client'

import type { DonationType } from '@/lib/validations/donation.validation'

const options: { value: DonationType; defaultPlan: string; title: string }[] = [
  { value: 'once', defaultPlan: 'once_friend', title: 'Once' },
  { value: 'monthly', defaultPlan: 'monthly_supporter', title: 'Monthly' },
  { value: 'yearly', defaultPlan: 'yearly-3000', title: 'Yearly' }
]

type Props = {
  donationType: DonationType
  setDonationType: (value: DonationType) => void
  setSelectedPlan: (value: string) => void
}

export function DonateTypeSelection({ donationType, setDonationType, setSelectedPlan }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Donation frequency"
      className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 mb-8"
    >
      {options.map(({ value, defaultPlan, title }) => {
        const isSelected = donationType === value

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => {
              setSelectedPlan(defaultPlan)
              setDonationType(value)
            }}
            className={`py-2.5 text-sm font-semibold rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              isSelected
                ? 'bg-white dark:bg-neutral-950 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            {title}
          </button>
        )
      })}
    </div>
  )
}
