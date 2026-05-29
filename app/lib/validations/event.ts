import { isValidUrl } from '../utils/isValidUrl'
import { Errors } from '@/app/lib/store/slices/formSlice'

const validateEventForm = (
  inputs: {
    [x: string]: any
    title?: any
    category?: any
    type?: any
    date?: any
    duration?: any
    location?: any
    maxAttendees?: any
    registrationUrl?: any
    meetingUrl?: any
    registrationDeadline?: any
  },
  setErrors: (newErrors: Errors) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.title || typeof inputs.title !== 'string' || !inputs.title.trim()) {
    newErrors.title = 'Please enter valid title'
  }

  if (!inputs?.category || typeof inputs.category !== 'string' || !inputs.category.trim()) {
    newErrors.category = 'Please enter valid category'
  }

  if (!inputs?.type || typeof inputs.type !== 'string' || !inputs.type.trim()) {
    newErrors.type = 'Please enter valid event type'
  }

  if (!inputs?.date) {
    newErrors.date = 'Please enter valid date'
  }

  if (!inputs?.duration || typeof inputs.duration !== 'string' || !inputs.duration.trim()) {
    newErrors.duration = 'Please enter valid duration'
  }

  if (!inputs?.location || typeof inputs.location !== 'string' || !inputs.location.trim()) {
    newErrors.location = 'Please enter valid location'
  }

  if (inputs?.maxAttendees && typeof inputs.maxAttendees === 'string' && isNaN(Number(inputs.maxAttendees))) {
    newErrors.maxAttendees = 'Please enter valid number'
  }

  if (
    inputs?.registrationUrl &&
    typeof inputs.registrationUrl === 'string' &&
    inputs.registrationUrl.trim() &&
    !isValidUrl(inputs.registrationUrl)
  ) {
    newErrors.registrationUrl = 'Please enter valid URL'
  }

  if (
    inputs?.meetingUrl &&
    typeof inputs.meetingUrl === 'string' &&
    inputs.meetingUrl.trim() &&
    !isValidUrl(inputs.meetingUrl)
  ) {
    newErrors.meetingUrl = 'Please enter valid URL'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateEventForm
