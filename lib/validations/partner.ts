import { IPartner } from '@/types/entities/partner'

const validatePartnerForm = (
  inputs: Partial<IPartner> | null,
  setErrors: (newErrors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.name || typeof inputs.name !== 'string' || !inputs.name.trim()) {
    newErrors.name = 'Please enter a valid name'
  }
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validatePartnerForm
