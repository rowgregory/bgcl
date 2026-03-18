export interface INews {
  id: string
  title: string
  image: string
  paragraph1: string
  paragraph2: string
  paragraph3: string
  order: number

  createdAt: Date
  updatedAt: Date
}

export interface CreateNewsInput {
  title: string
  image?: string
  paragraph1?: string
  paragraph2?: string
  paragraph3?: string
  order?: number
}

export interface UpdateNewsInput {
  id: string
  title: string
  image?: string
  paragraph1?: string
  paragraph2?: string
  paragraph3?: string
  order?: number
}
