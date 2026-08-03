import { z } from 'zod'

// additionalDetails is { title, input1, input2 }, not { label, value }
export const additionalDetailSchema = z.object({
  title: z.string().trim(),
  input1: z.string().trim(),
  input2: z.string().trim()
})

export type AdditionalDetail = z.infer<typeof additionalDetailSchema>

export const programThemeSchema = z.object({
  id: z.string(),
  title: z.string().trim(),
  dates: z.string().trim(),
  order: z.coerce.number().int(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish()
})

export type ProgramTheme = z.infer<typeof programThemeSchema>

// ── Program ───────────────────────────────────────────────────────────────────

export const programSchema = z.object({
  name: z.string().trim().min(1, { error: 'Please enter a program name' }),
  descriptions: z.array(z.string()).default([]),

  // Media
  image: z.string().trim().nullish(),
  imageTwo: z.string().trim().nullish(),

  // Age group
  ageGroup: z.string().trim().nullish(),
  showAgeGroup: z.boolean().default(false),

  // Logistics
  location: z.string().trim().nullish(),
  frequency: z.string().trim().nullish(),
  dropOffStart: z.string().trim().nullish(),
  dropOffEnd: z.string().trim().nullish(),
  pickUpStart: z.string().trim().nullish(),
  pickUpEnd: z.string().trim().nullish(),
  datesAvailable: z.string().trim().nullish(),
  license: z.string().trim().nullish(),

  // Extra content
  additionalDetails: z.array(additionalDetailSchema).default([]),
  showThemes: z.boolean().default(false),
  themes: z.array(programThemeSchema).default([]),

  // Links
  externalLink: z.string().trim().nullish(),
  pdfLink: z.string().trim().nullish(),
  pdfDescription: z.string().trim().nullish(),

  // Visibility
  isListed: z.boolean().default(false)
})

export type ProgramFormInput = z.input<typeof programSchema>
export type ProgramFormValues = z.output<typeof programSchema>

export const EMPTY_PROGRAM: ProgramFormInput = {
  name: '',
  descriptions: [],

  image: '',
  imageTwo: '',

  ageGroup: '',
  showAgeGroup: false,

  location: '',
  frequency: '',
  dropOffStart: '',
  dropOffEnd: '',
  pickUpStart: '',
  pickUpEnd: '',
  datesAvailable: '',
  license: '',

  additionalDetails: [],
  showThemes: false,
  themes: [],

  externalLink: '',
  pdfLink: '',
  pdfDescription: '',

  isListed: false
}

export const PROGRAM_NULLABLE_FIELDS = [
  'image',
  'imageTwo',
  'ageGroup',
  'location',
  'frequency',
  'dropOffStart',
  'dropOffEnd',
  'pickUpStart',
  'pickUpEnd',
  'datesAvailable',
  'license',
  'externalLink',
  'pdfLink',
  'pdfDescription'
] as const
