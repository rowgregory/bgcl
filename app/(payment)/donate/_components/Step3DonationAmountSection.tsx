'use client'

import { useFormContext } from 'react-hook-form'

import type { DonationFormInput } from '@/lib/validations/donation.validation'
import DonationTypeSelection from './DonationTypeSelection'
import OneTimeAmount from './OneTimeAmount'
import MonthlyPlans from './MonthlyPlans'
import YearlyPlans from './YearlyPlans'

export function Step3DonationAmountSection() {
  const { watch, setValue } = useFormContext<DonationFormInput>()

  const donationType = watch('donationType')
  const selectedPlan = watch('selectedPlan')
  const amount = watch('amount')

  const setSelectedPlan = (value: string) => setValue('selectedPlan', value, { shouldDirty: true })
  const setAmount = (value: number) => setValue('amount', value, { shouldValidate: true, shouldDirty: true })

  const planProps = { selectedPlan, setSelectedPlan, amount, setAmount }

  return (
    <div>
      <DonationTypeSelection
        donationType={donationType}
        setDonationType={(value) => setValue('donationType', value, { shouldDirty: true })}
        setSelectedPlan={setSelectedPlan}
      />
      {donationType === 'once' && <OneTimeAmount {...planProps} />}
      {donationType === 'monthly' && <MonthlyPlans {...planProps} />}
      {donationType === 'yearly' && <YearlyPlans {...planProps} />}
    </div>
  )
}
