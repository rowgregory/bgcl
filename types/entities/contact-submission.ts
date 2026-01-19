interface IContactSubmission {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subject?: string | null
  message?: string | null
  type: 'GENERAL' | 'VOLUNTEER'
  status: 'NEW' | 'READ' | 'ARCHIVED'

  // Availability
  availabilityDays?: string | null // "Monday,Wednesday,Friday"
  availabilityHours?: string | null // "Morning" | "Afternoon" | "Evening" | "Flexible"

  // Interest & Experience
  programInterests?: string | null // "KidsClub,TeenCenter,Sports"
  yearsExperience?: number | null

  // Legal/Info
  backgroundCheckAck?: boolean | null
  additionalInfo?: string | null

  createdAt?: Date
}
