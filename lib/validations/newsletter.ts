import { INewsletter } from '@/types/entities/newsletter'

const validateNewsletterForm = (
  inputs: Partial<INewsletter> | null,
  setErrors: (newErrors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.month || typeof inputs.month !== 'string' || !inputs.month.trim()) {
    newErrors.month = 'Please select a valid month'
  }

  if (!inputs?.year || typeof Number(inputs.year) !== 'number' || Number(inputs.year) < 2000) {
    newErrors.year = 'Please select a valid year'
  }

  if (!inputs?.pdfUrl || typeof inputs.pdfUrl !== 'string' || !inputs.pdfUrl.trim()) {
    newErrors.pdfUrl = 'Please enter a valid PDF URL'
  }

  if (typeof inputs?.pdfUrl === 'string' && inputs.pdfUrl.trim() && !inputs.pdfUrl.startsWith('http')) {
    newErrors.pdfUrl = 'PDF URL must start with http or https'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateNewsletterForm
