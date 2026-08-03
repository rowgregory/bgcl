import { z } from 'zod'

export const TEAM_MEMBER_ROLES = [
  'officer',
  'director',
  'corporator',
  'admin_staff',
  'program_staff',
  'maintenance_staff',
  'honoree',
  'fame',
  'helping',
  'commitment',
  'youth'
] as const

export type TeamMemberRole = (typeof TEAM_MEMBER_ROLES)[number]

export const teamMemberSchema = z
  .object({
    name: z.string().trim().min(1, { error: 'Please enter a valid name' }),
    title: z.string().trim().nullish(),
    company: z.string().trim().nullish(),
    image: z.string().trim().nullish(),
    bio: z.string().trim().nullish(),
    phone: z.string().trim().nullish(),
    email: z.email({ error: 'Enter a valid email address' }).or(z.literal('')).nullish(),
    role: z.enum(TEAM_MEMBER_ROLES, { error: 'Please select a valid role' }),

    year: z.coerce.number().int().gte(1900).lte(2100).nullish(),
    paragraph1: z.string().trim().nullish(),
    paragraph2: z.string().trim().nullish(),
    paragraph3: z.string().trim().nullish()
  })
  .superRefine((data, ctx) => {
    if (data.role === 'youth' && !data.year) {
      ctx.addIssue({
        code: 'custom',
        path: ['year'],
        message: 'Youth of the Year entries need a year'
      })
    }
  })

export type TeamMemberFormInput = z.input<typeof teamMemberSchema>
export type TeamMemberFormValues = z.output<typeof teamMemberSchema>

export const EMPTY_TEAM_MEMBER: TeamMemberFormInput = {
  name: '',
  title: '',
  company: '',
  image: '',
  bio: '',
  phone: '',
  email: '',
  role: 'director',
  year: undefined,
  paragraph1: '',
  paragraph2: '',
  paragraph3: ''
}

export const TEAM_MEMBER_NULLABLE_FIELDS = [
  'title',
  'company',
  'image',
  'bio',
  'phone',
  'email',
  'paragraph1',
  'paragraph2',
  'paragraph3'
] as const

export const TEAM_MEMBER_ROLE_LABELS: Record<TeamMemberRole, string> = {
  officer: 'Officer',
  director: 'Director',
  corporator: 'Corporator',
  admin_staff: 'Administrative Staff',
  program_staff: 'Program Staff',
  maintenance_staff: 'Maintenance Staff',
  honoree: 'Honoree',
  fame: 'Hall of Fame',
  helping: 'Helping Hands',
  commitment: 'Commitment Award',
  youth: 'Youth of the Year'
}
