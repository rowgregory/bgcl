import { z } from 'zod'

import { AVAILABILITY_DAYS, AVAILABILITY_HOURS } from '@/lib/constants/contact.constants'

// Shared identity fields. Spread rather than `.extend()` so the inferred object
// type stays plain.
const contactFields = {
  firstName: z.string().trim().min(1, { error: 'Please enter a first name' }),
  lastName: z.string().trim().min(1, { error: 'Please enter a last name' }),
  email: z.email({ error: 'Please enter a valid email address' }),
  phone: z.string().trim().min(1, { error: 'Please enter a phone number' })
}

/* -------------------------------------------------------------------------- */
/* General contact                                                            */
/* -------------------------------------------------------------------------- */

export const contactSubmissionSchema = z.object({
  ...contactFields,
  subject: z.string().trim().nullish(),
  message: z.string().trim().min(1, { error: 'Please enter a message' })
})

export type ContactSubmissionFormInput = z.input<typeof contactSubmissionSchema>
export type ContactSubmissionFormValues = z.output<typeof contactSubmissionSchema>

export const EMPTY_CONTACT_SUBMISSION: ContactSubmissionFormInput = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
}

export const CONTACT_SUBMISSION_NULLABLE_FIELDS = ['subject'] as const

/* -------------------------------------------------------------------------- */
/* Volunteer application                                                      */
/* -------------------------------------------------------------------------- */

export const volunteerSubmissionSchema = z.object({
  ...contactFields,
  subject: z.string().trim().nullish(),
  message: z.string().trim().nullish(),

  // Arrays in the form, joined to a comma string in the action
  availabilityDays: z.array(z.enum(AVAILABILITY_DAYS)).min(1, { error: 'Please choose at least one day' }),
  availabilityHours: z.enum(AVAILABILITY_HOURS, { error: 'Please choose a time of day' }),
  programInterests: z.array(z.string()).min(1, { error: 'Please choose at least one program' }),

  // Column is Int?, but kept as a string here for the same reason dates are:
  // `z.coerce.number()` turns an empty input into 0, which would store "0 years"
  // where the person left it blank. The action does `Number(...)` or null.
  yearsExperience: z.string().trim().regex(/^\d*$/, { error: 'Please enter a whole number of years' }).nullish(),

  // `z.literal(true)` would narrow the inferred type to `true` and break EMPTY_*,
  // so refine instead.
  backgroundCheckAck: z
    .boolean()
    .refine((value) => value === true, { error: 'Please acknowledge the background check' }),

  additionalInfo: z.string().trim().nullish()
})

export type VolunteerSubmissionFormInput = z.input<typeof volunteerSubmissionSchema>
export type VolunteerSubmissionFormValues = z.output<typeof volunteerSubmissionSchema>

export const EMPTY_VOLUNTEER_SUBMISSION: VolunteerSubmissionFormInput = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  availabilityDays: [],
  availabilityHours: 'flexible',
  programInterests: [],
  yearsExperience: '',
  backgroundCheckAck: false,
  additionalInfo: ''
}

// `availabilityDays` / `programInterests` aren't listed: `emptyToNull` is string
// fields only, and the action joins them before writing.
export const VOLUNTEER_SUBMISSION_NULLABLE_FIELDS = ['subject', 'message', 'additionalInfo'] as const
