export const initialContactSubmissionFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: 'tour',
  message: null,
  type: 'GENERAL' as const,
  status: 'NEW' as const,

  // Availability
  availabilityDays: null,
  availabilityHours: null,

  // Interest & Experience
  programInterests: null,
  yearsExperience: null,

  // Legal/Info
  backgroundCheckAck: null,
  additionalInfo: null
}
