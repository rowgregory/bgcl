import { Errors } from '@/app/lib/store/slices/formSlice'
import { Ticket } from '@prisma/client'

const validateTicketForm = (inputs: Partial<Ticket> | null, setErrors: (newErrors: Errors) => void) => {
  const newErrors: Record<string, string> = {}

  // Name validation
  if (!inputs?.name || typeof inputs.name !== 'string' || !inputs.name.trim()) {
    newErrors.name = 'Please enter a valid ticket name'
  }

  // Price validation
  if (inputs?.price === undefined || inputs.price === null || inputs.price === 0) {
    newErrors.price = 'Please enter a price'
  } else if (typeof inputs.price !== 'number' && isNaN(Number(inputs.price))) {
    newErrors.price = 'Price must be a valid number'
  } else if (Number(inputs.price) < 0) {
    newErrors.price = 'Price cannot be negative'
  }

  // Total quantity validation
  if (inputs?.totalQuantity === undefined || inputs.totalQuantity === null || inputs.totalQuantity === 0) {
    newErrors.totalQuantity = 'Please enter total quantity'
  } else if (!Number.isInteger(Number(inputs.totalQuantity))) {
    newErrors.totalQuantity = 'Quantity must be a whole number'
  } else if (Number(inputs.totalQuantity) <= 0) {
    newErrors.totalQuantity = 'Quantity must be greater than 0'
  }

  // Sort order validation
  if (inputs?.sortOrder !== undefined && inputs.sortOrder !== null && inputs.sortOrder !== -1) {
    if (!Number.isInteger(Number(inputs.sortOrder))) {
      newErrors.sortOrder = 'Sort order must be a whole number'
    } else if (Number(inputs.sortOrder) < 0) {
      newErrors.sortOrder = 'Sort order cannot be negative'
    }
  }

  // Event ID validation (required for creating tickets)
  if (!inputs?.eventId || typeof inputs.eventId !== 'string' || !inputs.eventId.trim()) {
    newErrors.eventId = 'Event ID is required'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateTicketForm
