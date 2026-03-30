// utils/formHelpers.ts

/**
 * Converts a Date object or ISO string to the format required by HTML input type="date" (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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
  const dateObj = typeof utcDate === 'string' ? new Date(utcDate) : utcDate

  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  const timeString = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return {
    dateString: `${month}-${day}-${year}`,
    timeString
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

export const formatDate = (date: Date, options?: any) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  })
}

export function formatDatetimeLocalForInput(value: Date | string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (isNaN(date.getTime())) return ''

  // Convert to EST (America/New_York handles EST/EDT automatically)
  const estString = date.toLocaleString('en-US', { timeZone: 'America/New_York' })
  const estDate = new Date(estString)

  const year = estDate.getFullYear()
  const month = String(estDate.getMonth() + 1).padStart(2, '0')
  const day = String(estDate.getDate()).padStart(2, '0')
  const hours = String(estDate.getHours()).padStart(2, '0')
  const minutes = String(estDate.getMinutes()).padStart(2, '0')

  // datetime-local expects "YYYY-MM-DDTHH:mm"
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
