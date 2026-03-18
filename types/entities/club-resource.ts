export interface IClubResource {
  id: string
  title: string
  url: string
  order: number

  createdAt: Date
  updatedAt: Date
}

export interface UpdateClubResourceInput {
  id: string
  title: string
  url: string
  order?: number
}

export interface CreateClubResourceInput {
  title: string
  url?: string
  order?: number
}
