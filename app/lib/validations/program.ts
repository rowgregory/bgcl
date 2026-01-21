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

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateProgramForm
