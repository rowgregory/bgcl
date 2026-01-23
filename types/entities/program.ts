import { JsonValue } from '@prisma/client/runtime/library'

export interface IProgram {
  id: string
  name: string
  descriptions: JsonValue
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

export interface ICreateProgram {
  name: string
  description1: string
  description2?: string
  description3?: string
  description4?: string
  description5?: string
  ageGroup: string
  location: string
  frequency: string
  dropOffStart?: string | null
  dropOffEnd?: string | null
  pickUpStart?: string | null
  pickUpEnd?: string | null
  datesAvailable?: string | null
  license?: string | null
  createdBy?: string | null
  [key: string]: any
}

export interface IUpdateProgram {
  id: string
  name?: string
  description?: string
  ageGroup?: string
  location?: string
  frequency?: string
  dropOffStart?: string
  dropOffEnd?: string
  pickUpStart?: string
  pickUpEnd?: string
  datesAvailable?: string | null
  license?: string | null
  [key: string]: any
}
