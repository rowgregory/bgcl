/**
 * `availabilityHours` and `programInterests` are free-text columns, so the
 * allowed values live here and the schemas validate against them. Moving either
 * to a Prisma enum later means swapping `z.enum(AVAILABILITY_HOURS)` for
 * `z.enum(PrismaEnum)` and nothing else.
 */

export const AVAILABILITY_HOURS = ['morning', 'afternoon', 'evening', 'flexible'] as const
export type AvailabilityHours = (typeof AVAILABILITY_HOURS)[number]

export const AVAILABILITY_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
export type AvailabilityDay = (typeof AVAILABILITY_DAYS)[number]

export const PROGRAM_INTERESTS = ['KidsClub', 'TeenCenter', 'Sports', 'Arts', 'Education', 'Events'] as const
export type ProgramInterest = (typeof PROGRAM_INTERESTS)[number]

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const AVAILABILITY_HOURS_OPTIONS: { value: AvailabilityHours; label: string }[] = [
  { value: 'morning', label: 'Morning (8am - 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
  { value: 'evening', label: 'Evening (5pm - 8pm)' },
  { value: 'flexible', label: 'Flexible' }
]

export const CONTACT_SUBJECT_OPTIONS = [
  { value: 'tour', label: 'Schedule a Tour' },
  { value: 'other', label: 'Other' }
] as const
