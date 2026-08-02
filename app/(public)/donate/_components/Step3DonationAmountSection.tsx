import { setDonateCheckoutForm as setForm } from '@/lib/utils/setDonateCheckoutForm'
import DonationTypeSelection from './DonationTypeSelection'
import OneTimeAmount from './OneTimeAmount'
import MonthlyPlans from './MonthlyPlans'
import YearlyPlans from './YearlyPlans'

export function Step3DonationAmountSection({ inputs }: { inputs: any }) {
  return (
    <div>
      <DonationTypeSelection
        donationType={inputs?.donationType}
        setDonationType={(value) => setForm({ donationType: value })}
        setSelectedPlan={(value) => setForm({ selectedPlan: value })}
      />
      {inputs?.donationType === 'once' && (
        <OneTimeAmount
          selectedPlan={inputs?.selectedPlan}
          setSelectedPlan={(value) => setForm({ selectedPlan: value })}
          amount={inputs?.amount}
          setAmount={(value) => setForm({ amount: value })}
        />
      )}
      {inputs?.donationType === 'monthly' && (
        <MonthlyPlans
          selectedPlan={inputs?.selectedPlan}
          setSelectedPlan={(value) => setForm({ selectedPlan: value })}
          amount={inputs?.amount}
          setAmount={(value) => setForm({ amount: value })}
        />
      )}
      {inputs?.donationType === 'yearly' && (
        <YearlyPlans
          selectedPlan={inputs?.selectedPlan}
          setSelectedPlan={(value) => setForm({ selectedPlan: value })}
          amount={inputs?.amount}
          setAmount={(value) => setForm({ amount: value })}
        />
      )}
    </div>
  )
}
