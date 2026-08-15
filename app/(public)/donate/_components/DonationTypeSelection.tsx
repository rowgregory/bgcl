'use client'

import type { DonationType } from '@/lib/validations/donation.validation'

const options: { value: DonationType; defaultPlan: string; title: string; description: string }[] = [
  { value: 'once', defaultPlan: 'once_friend', title: 'One-Time', description: 'Single donation' },
  { value: 'monthly', defaultPlan: 'monthly_supporter', title: 'Monthly', description: 'Recurring support' },
  { value: 'yearly', defaultPlan: 'yearly-3000', title: 'Yearly', description: 'Annual subscription' }
]

type Props = {
  donationType: DonationType
  setDonationType: (value: DonationType) => void
  setSelectedPlan: (value: string) => void
}

export default function DonationTypeSelection({ donationType, setDonationType, setSelectedPlan }: Props) {
  return (
    <div role="radiogroup" aria-label="Donation frequency" className="grid sm:grid-cols-3 gap-2 mb-8">
      {options.map(({ value, defaultPlan, title, description }) => {
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
            className={`p-3 rounded-lg border-2 transition-all text-center ${
              isSelected
                ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-500/10'
                : 'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 hover:border-neutral-300'
            }`}
          >
            <p
              className={`font-semibold text-sm ${
                isSelected ? 'dark:text-white text-neutral-900' : 'dark:text-zinc-300 text-neutral-700'
              }`}
            >
              {title}
            </p>
            <p className={`text-xs dark:text-zinc-400 ${isSelected ? 'text-neutral-600' : 'text-neutral-500'}`}>
              {description}
            </p>
          </button>
        )
      })}
    </div>
  )
}
