'use client'

import { useFormContext } from 'react-hook-form'

import type { DonationFormInput, DonationType } from '@/lib/validations/donation.validation'
import { ONE_TIME_PLANS, MONTHLY_PLANS, YEARLY_PLANS } from '@/lib/constants/donate.constants'
import { DonateTypeSelection } from './DonateTypeSelection'
import { DonateAmountSelector } from './DonateAmountSelector'

const AMOUNT_CONFIG: Record<DonationType, { plans: any[]; customId: string; label: string; suffix?: string }> = {
  once: { plans: ONE_TIME_PLANS, customId: 'once-custom', label: 'Choose an amount' },
  monthly: { plans: MONTHLY_PLANS, customId: 'monthly-custom', label: 'Choose a monthly amount', suffix: '/mo' },
  yearly: { plans: YEARLY_PLANS, customId: 'yearly-custom', label: 'Choose a yearly amount', suffix: '/yr' }
}

export function DonateAmountSection() {
  const { watch, setValue } = useFormContext<DonationFormInput>()

  const donationType = watch('donationType')
  const selectedPlan = watch('selectedPlan')
  const amount = watch('amount')

  const setSelectedPlan = (value: string) => setValue('selectedPlan', value, { shouldDirty: true })
  const setAmount = (value: number) => setValue('amount', value, { shouldValidate: true, shouldDirty: true })

  const config = AMOUNT_CONFIG[donationType]

  return (
    <div>
      <DonateTypeSelection
        donationType={donationType}
        setDonationType={(value) => setValue('donationType', value, { shouldDirty: true })}
        setSelectedPlan={setSelectedPlan}
      />

      {config && (
        <DonateAmountSelector
          key={donationType}
          plans={config.plans}
          customId={config.customId}
          label={config.label}
          suffix={config.suffix}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          amount={amount}
          setAmount={setAmount}
        />
      )}
    </div>
  )
}
