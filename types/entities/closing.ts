export interface IClosing {
  id: string
  title: string
  date: string

  createdAt: Date
  updatedAt: Date
}

export interface UpdateClosingInput {
  id: string
  title: string
  date: string
  order: number
}

export interface CreateClosingInput {
  title: string
  date: string
  order: number
}
