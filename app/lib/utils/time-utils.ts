// lib/utils/timeUtils.ts

/**
 * Convert military time (24-hour format) to 12-hour format with AM/PM
 * @param militaryTime - Time in format "HH:mm" (e.g., "14:30", "09:00")
 * @returns Time in format "h:mm AM/PM" (e.g., "2:30 PM", "9:00 AM")
 */
export function militaryToRegularTime(militaryTime: string): string {
  if (!militaryTime || typeof militaryTime !== 'string') return ''

  try {
    const [hours, minutes] = militaryTime.split(':')
    const hour = parseInt(hours, 10)
    const minute = parseInt(minutes, 10)

    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return ''
    }

    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    const displayMinute = String(minute).padStart(2, '0')

    return `${displayHour}:${displayMinute} ${ampm}`
  } catch {
    return ''
  }
}

/**
 * Convert 12-hour time to military time (24-hour format)
 * @param regularTime - Time in format "h:mm AM/PM" (e.g., "2:30 PM", "9:00 AM")
 * @returns Time in format "HH:mm" (e.g., "14:30", "09:00")
 */
export function regularToMilitaryTime(regularTime: string): string {
  if (!regularTime || typeof regularTime !== 'string') return ''

  try {
    const match = regularTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (!match) return ''

    const [, hours, minutes, period] = match
    let hour = parseInt(hours, 10)

    if (period.toUpperCase() === 'PM' && hour !== 12) {
      hour += 12
    } else if (period.toUpperCase() === 'AM' && hour === 12) {
      hour = 0
    }

    const displayHour = String(hour).padStart(2, '0')
    const displayMinute = String(minutes).padStart(2, '0')

    return `${displayHour}:${displayMinute}`
  } catch {
    return ''
  }
}

export const formatTimeForInput = (date: Date | string | null | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  })
}
