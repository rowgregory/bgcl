import { Errors, Inputs } from '@/app/redux/features/formSlice'

const validateEventTicketForm = (inputs: Inputs, setErrors: (newErrors: Errors) => void) => {
  const newErrors: Errors = {}

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

  // Min per order validation
  if (inputs?.minPerOrder !== undefined && inputs.minPerOrder !== null && inputs.minPerOrder !== 0) {
    if (!Number.isInteger(Number(inputs.minPerOrder))) {
      newErrors.minPerOrder = 'Minimum per order must be a whole number'
    } else if (Number(inputs.minPerOrder) < 1) {
      newErrors.minPerOrder = 'Minimum per order must be at least 1'
    }
  }

  // Max per order validation
  if (inputs?.maxPerOrder !== undefined && inputs.maxPerOrder !== null && inputs.maxPerOrder !== 0) {
    if (!Number.isInteger(Number(inputs.maxPerOrder))) {
      newErrors.maxPerOrder = 'Maximum per order must be a whole number'
    } else if (Number(inputs.maxPerOrder) < 1) {
      newErrors.maxPerOrder = 'Maximum per order must be at least 1'
    } else if (inputs.minPerOrder && Number(inputs.maxPerOrder) < Number(inputs.minPerOrder)) {
      newErrors.maxPerOrder = 'Maximum per order must be greater than or equal to minimum'
    }
  }

  // Sales start date validation - ADD TYPE GUARDS
  if (inputs?.salesStartDate && inputs?.salesEndDate) {
    const startValue = inputs.salesStartDate
    const endValue = inputs.salesEndDate

    // Only validate if both are valid date types
    if (
      (typeof startValue === 'string' || startValue instanceof Date) &&
      (typeof endValue === 'string' || endValue instanceof Date)
    ) {
      const startDate = new Date(startValue)
      const endDate = new Date(endValue)

      if (startDate >= endDate) {
        newErrors.salesStartDate = 'Sales start date must be before end date'
      }
    }
  }

  // Sales end date validation - ADD TYPE GUARD
  if (inputs?.salesEndDate) {
    const endValue = inputs.salesEndDate

    if (typeof endValue === 'string' || endValue instanceof Date) {
      const endDate = new Date(endValue)
      const now = new Date()

      if (endDate < now) {
        newErrors.salesEndDate = 'Sales end date cannot be in the past'
      }
    }
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
  if (!inputs?.id || typeof inputs.id !== 'string' || !inputs.id.trim()) {
    newErrors.id = 'Event ID is required'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateEventTicketForm
