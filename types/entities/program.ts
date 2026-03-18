import { JsonValue } from '@prisma/client/runtime/library'

export interface IProgram {
  id: string
  name: string
  descriptions: string[]
  image?: string
  imageTwo?: string
  ageGroup?: string
  showAgeGroup?: boolean
  location?: string
  frequency?: string
  dropOffStart?: string | null
  dropOffEnd?: string | null
  pickUpStart?: string | null
  pickUpEnd?: string | null
  datesAvailable?: string | null
  license?: string | null
  order: number
  additionalDetails?: JsonValue
  themes: JsonValue
  showThemes: boolean
  externalLink?: string
  pdfLink?: string
  pdfDescription?: string
  isListed?: boolean
  createdAt: Date
  updatedAt: Date

  // Deprecated
  description1: string
  description2?: string
  description3?: string
  description4?: string
  description5?: string
  heroImage?: string
}

export interface CreateProgramInputs {
  [key: string]: any
}

export interface UpdateProgramInputs {
  id: string
  [key: string]: any
}
