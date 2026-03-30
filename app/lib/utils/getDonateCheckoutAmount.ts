import { MONTHLY_PLANS, ONE_TIME_PLANS, YEARLY_PLANS } from '../constants/donate-page'

export const getDonateCheckoutAmount = (inputs) => {
  // If a preset plan is selected, get its amount
  if (inputs?.selectedPlan && !inputs?.selectedPlan.includes('custom')) {
    const plans =
      inputs?.donationType === 'monthly'
        ? MONTHLY_PLANS
        : inputs?.donationType === 'once'
          ? ONE_TIME_PLANS
          : YEARLY_PLANS
    return plans.find((p) => p.id === inputs?.selectedPlan)?.amount || 0
  }

  // Otherwise use the amount input (for one-time or custom recurring)
  return parseFloat(inputs?.amount?.toString()) || 0
}
