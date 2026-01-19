import { IClubResource } from '@/types/entities/club-resource'

const validateClubResourceForm = (
  inputs: Partial<IClubResource> | null,
  setErrors: (newErrors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.title || typeof inputs.title !== 'string' || !inputs.title.trim()) {
    newErrors.title = 'Please enter a valid title'
  }

  if (!inputs?.url || typeof inputs.url !== 'string' || !inputs.url.trim()) {
    newErrors.url = 'Please enter a valid url'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateClubResourceForm
