import { IClosing } from '@/types/entities/closing'

const validateClosingForm = (
  inputs: Partial<IClosing> | null,
  setErrors: (newErrors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.title || typeof inputs.title !== 'string' || !inputs.title.trim()) {
    newErrors.title = 'Please enter a valid title'
  }

  if (!inputs?.date || typeof inputs.date !== 'string' || !inputs.date.trim()) {
    newErrors.date = 'Please enter a valid date'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateClosingForm
