export interface INews {
  id: string
  title: string
  image: string
  paragraph1: string
  paragraph2: string
  paragraph3: string
  order: number
  externalLink?: string
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
  externalLink?: string
}

export interface UpdateNewsInput {
  id: string
  title: string
  image?: string
  paragraph1?: string
  paragraph2?: string
  paragraph3?: string
  order?: number
  externalLink?: string
}
