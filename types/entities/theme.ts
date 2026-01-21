export interface ITheme {
  id: string
  week: string
  title: string
  dates: string
  order: number
  programId: string

  createdAt: Date
  updatedAt: Date
}

export interface ICreateTheme {
  week: string
  title: string
  dates: string
  order: number
  programId: string
}

export interface IUpdateTheme {
  id: string
  title?: string
  dates?: string
  order?: number
}
