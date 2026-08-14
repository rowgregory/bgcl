// All dates render in the club's timezone so the server and client agree
const TIME_ZONE = 'America/New_York'

export const formatLongDate = (value: Date | string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: TIME_ZONE
  })

export const formatShortDate = (value: Date | string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: TIME_ZONE
  })

export const formatTicketDate = (value: Date | string) =>
  new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: TIME_ZONE
  })

export const formatEventDateTime = (value: Date | string) => {
  const date = new Date(value)

  const day = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: TIME_ZONE
  })

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: TIME_ZONE
  })

  return `${day} at ${time}`
}
