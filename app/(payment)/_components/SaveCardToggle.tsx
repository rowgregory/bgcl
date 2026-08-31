'use client'

import { ToggleCard } from '@/components/_shared/ToggleCard'
import { CreditCard } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Controller, useFormContext } from 'react-hook-form'

// Shared by the ticket checkout and the donate flow, so the shape is the union
// of what both forms hold. `donationType` is absent on checkout.
type SharedPaymentFields = {
  saveCard: boolean
  selectedCardId?: string | null
  useNewCard?: boolean
  donationType?: string | null
}

export function SaveCardToggle() {
  const { status } = useSession()
  const isAuthed = status === 'authenticated'

  const { control, watch } = useFormContext<SharedPaymentFields>()

  const selectedCardId = watch('selectedCardId')
  const useNewCard = watch('useNewCard')
  const donationType = watch('donationType')

  const usingExistingCard = Boolean(selectedCardId) && !useNewCard
  const isRecurring = donationType === 'monthly' || donationType === 'yearly'

  if (!isAuthed || usingExistingCard || isRecurring) return null

  return (
    <Controller
      name="saveCard"
      control={control}
      render={({ field: { value, onChange } }) => (
        <ToggleCard
          checked={!!value}
          onChange={onChange}
          Icon={CreditCard}
          title="Save card for future payments"
          description="One-click checkout next time"
        />
      )}
    />
  )
}
