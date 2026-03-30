import { useEffect } from 'react'
import { setDonateCheckoutForm as setForm } from '../utils/setDonateCheckoutForm'

type IInitilizeForm = {
  savedCards: any[]
  selectedPlan?: string
  amount?: number
  donationType?: string
}

export function useInitializeForm({ savedCards, selectedPlan, amount, donationType }: IInitilizeForm) {
  useEffect(() => {
    setForm({
      useNewCard: savedCards?.length === 0,
      selectedCardId: savedCards?.find((c) => c.isDefault)?.stripePaymentId ?? null,
      coverFees: true,
      selectedPlan,
      amount,
      donationType
    })
  }, [amount, savedCards, savedCards?.length, selectedPlan, donationType])
}
