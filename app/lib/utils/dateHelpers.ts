// utils/formHelpers.ts

/**
 * Converts a Date object or ISO string to the format required by HTML input type="date" (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | string | number | boolean | null | undefined): string => {
  if (!date || typeof date === 'boolean' || typeof date === 'number') return ''

  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return ''
    return dateObj.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

/**
 * Converts a Date object or ISO string to the format required by HTML input type="datetime-local" (YYYY-MM-DDTHH:MM)
 */
export const formatDateTimeForInput = (dateTime: Date | string | number | boolean | null | undefined): string => {
  if (!dateTime || typeof dateTime === 'boolean' || typeof dateTime === 'number') return ''

  try {
    const dateObj = dateTime instanceof Date ? dateTime : new Date(dateTime)
    if (isNaN(dateObj.getTime())) return ''
    return dateObj.toISOString().slice(0, 16)
  } catch {
    return ''
  }
}
