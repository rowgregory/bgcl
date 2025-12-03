import { isValidUrl } from '../utils/isValidUrl'
import { Errors, Inputs } from '@/app/redux/features/formSlice'

const validateEventForm = (inputs: Inputs, setErrors: (newErrors: Errors) => void) => {
  const newErrors: Errors = {}

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

  if (!inputs?.time || typeof inputs.time !== 'string' || !inputs.time.trim()) {
    newErrors.time = 'Please enter valid time'
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

  if (inputs?.requiresRSVP && !inputs?.registrationDeadline) {
    newErrors.registrationDeadline = 'Registration deadline required when RSVP is enabled'
  }

  if (inputs?.salesStartDate && inputs?.salesEndDate) {
    const start = new Date(inputs.salesStartDate as Date | string)
    const end = new Date(inputs.salesEndDate as Date | string)
    if (start >= end) {
      newErrors.salesEndDate = 'Sales end date must be after start date'
    }
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateEventForm
