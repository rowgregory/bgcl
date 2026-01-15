import { User } from '@prisma/client'

const validateUserForm = (inputs: Partial<User> | null, setErrors: (newErrors: Record<string, string>) => void) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.email || typeof inputs.email !== 'string' || !inputs.email.trim()) {
    newErrors.email = 'Please enter a valid email'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
    newErrors.email = 'Please enter a valid email format'
  }

  if (!inputs?.firstName || typeof inputs.firstName !== 'string' || !inputs.firstName.trim()) {
    newErrors.firstName = 'Please enter a valid first name'
  }

  if (!inputs?.lastName || typeof inputs.lastName !== 'string' || !inputs.lastName.trim()) {
    newErrors.lastName = 'Please enter a valid last name'
  }

  if (!inputs?.role || typeof inputs.role !== 'string' || !inputs.role.trim()) {
    newErrors.role = 'Please select a valid role'
  }

  if (inputs?.phone && typeof inputs.phone === 'string' && inputs.phone.trim()) {
    const phoneRegex = /^[\d\s\-\(\)]+$/.test(inputs.phone)
    if (!phoneRegex) {
      newErrors.phone = 'Please enter a valid phone number'
    }
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateUserForm
