'use client'

import { Heart } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import { ToggleCard } from '@/components/_shared/ToggleCard'

export function CoverFeesToggle({ processingFee }: { processingFee: number }) {
  const { control } = useFormContext<{ coverFees: boolean }>()

  return (
    <Controller
      name="coverFees"
      control={control}
      render={({ field: { value, onChange } }) => (
        <ToggleCard
          checked={!!value}
          onChange={onChange}
          Icon={Heart}
          title="Cover processing fees"
          description={`Add $${processingFee.toFixed(2)} so 100% goes to the club`}
        />
      )}
    />
  )
}
