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
 * Combine date and time inputs into a UTC DateTime for database storage
 * @param dateString - Date from input type="date" (YYYY-MM-DD)
 * @param timeString - Time from input type="time" (HH:mm)
 * @returns UTC Date object for database
 */
export function combineDateTimeToUTC(dateInput: string | Date, timeString: string): Date {
  // Convert Date to string if needed
  let dateString: string

  if (dateInput instanceof Date) {
    const year = dateInput.getFullYear()
    const month = String(dateInput.getMonth() + 1).padStart(2, '0')
    const day = String(dateInput.getDate()).padStart(2, '0')
    dateString = `${year}-${month}-${day}`
  } else {
    dateString = dateInput
  }

  // Create a local datetime string: "2026-01-04T18:00:00"
  const localDateTimeString = `${dateString}T${timeString}:00`

  // Parse as local time
  const localDate = new Date(localDateTimeString)

  // Convert to UTC by accounting for the timezone offset
  const offsetMs = localDate.getTimezoneOffset() * 60 * 1000
  const utcDate = new Date(localDate.getTime() + offsetMs)

  return utcDate
}

/**
 * Convert UTC date from database back to separate date and time for form
 * @param utcDate - UTC Date from database
 * @returns Object with dateString (YYYY-MM-DD) and timeString (HH:mm)
 */
export function splitUTCToDateTime(utcDate: Date | string): { dateString: string; timeString: string } {
  // Convert to Date object if string
  const dateObj = typeof utcDate === 'string' ? new Date(utcDate) : utcDate

  // Convert UTC to local timezone (EST/EDT)
  const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60 * 1000)

  const year = localDate.getFullYear()
  const month = String(localDate.getMonth() + 1).padStart(2, '0')
  const day = String(localDate.getDate()).padStart(2, '0')
  const hours = String(localDate.getHours()).padStart(2, '0')
  const minutes = String(localDate.getMinutes()).padStart(2, '0')

  return {
    dateString: `${year}-${month}-${day}`,
    timeString: `${hours}:${minutes}`
  }
}

/**
 * Convert date string to UTC Date (midnight UTC)
 * @param dateString - Date in format "YYYY-MM-DD" (e.g., "2026-01-04")
 * @returns UTC Date object at midnight for database storage
 */
export function convertDateToUTC(dateInput: string | Date): Date {
  if (!dateInput) {
    throw new Error('Date is required')
  }

  try {
    let dateString: string

    if (dateInput instanceof Date) {
      const year = dateInput.getFullYear()
      const month = String(dateInput.getMonth() + 1).padStart(2, '0')
      const day = String(dateInput.getDate()).padStart(2, '0')
      dateString = `${year}-${month}-${day}`
    } else {
      dateString = dateInput
    }

    const localDateTimeString = `${dateString}T00:00:00`
    const localDate = new Date(localDateTimeString)
    const offsetMs = localDate.getTimezoneOffset() * 60 * 1000
    const utcDate = new Date(localDate.getTime() + offsetMs)

    return utcDate
  } catch (error) {
    throw new Error(`Failed to convert date: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
