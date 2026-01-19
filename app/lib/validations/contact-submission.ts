import { Errors } from '../store/slices/formSlice'

export const validateContactSubmissionForm = (inputs, setErrors: (newErrors: Errors) => void) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.firstName || typeof inputs.firstName !== 'string' || !inputs.firstName.trim()) {
    newErrors.firstName = 'Please enter a valid first name'
  }

  if (!inputs?.lastName || typeof inputs.lastName !== 'string' || !inputs.lastName.trim()) {
    newErrors.lastName = 'Please enter a valid last name'
  }

  if (!inputs?.email || typeof inputs.email !== 'string' || !inputs.email.trim()) {
    newErrors.email = 'Please enter a valid email address'
  }

  if (inputs?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
    newErrors.email = 'Please enter a valid email format'
  }

  if (!inputs?.phone || typeof inputs.phone !== 'string' || !inputs.phone.trim()) {
    newErrors.phone = 'Please enter a valid phone number'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
