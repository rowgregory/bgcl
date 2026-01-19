export interface IProgram {
  id: string
  name: string
  description1: string
  description2?: string
  description3?: string
  description4?: string
  description5?: string
  image?: string
  heroImage?: string
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
  createdAt: Date
  updatedAt: Date
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
