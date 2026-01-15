import { IProgram } from '@/types/entities/program'

const validateProgramForm = (
  inputs: Partial<IProgram> | null,
  setErrors: (newErrors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.name || typeof inputs.name !== 'string' || !inputs.name.trim()) {
    newErrors.name = 'Please enter a valid program name'
  }

  if (!inputs?.description1 || typeof inputs.description1 !== 'string' || !inputs.description1.trim()) {
    newErrors.description1 = 'Please enter a valid description'
  }

  if (!inputs?.ageGroup || typeof inputs.ageGroup !== 'string' || !inputs.ageGroup.trim()) {
    newErrors.ageGroup = 'Please enter a valid age group'
  }

  if (!inputs?.location || typeof inputs.location !== 'string' || !inputs.location.trim()) {
    newErrors.location = 'Please enter a valid location'
  }

  if (!inputs?.frequency || typeof inputs.frequency !== 'string' || !inputs.frequency.trim()) {
    newErrors.frequency = 'Please select a valid frequency'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateProgramForm
