import { IProgram } from '@/types/entities/program'

const validateProgramForm = (
  inputs: Partial<IProgram> | null,
  setErrors: (newErrors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.name || typeof inputs.name !== 'string' || !inputs.name.trim()) {
    newErrors.name = 'Please enter a valid program name'
  }

  if (!inputs?.descriptions || inputs.descriptions?.length === 0) {
    newErrors.descriptions = 'Please enter at least one description'
  }

  if (inputs?.descriptions && inputs.descriptions.length > 0) {
    const hasValidDescription = inputs.descriptions.some((desc: string) => desc && desc.trim().length > 0)

    if (!hasValidDescription) {
      newErrors.descriptions = 'At least one description must be filled out'
    }
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateProgramForm
