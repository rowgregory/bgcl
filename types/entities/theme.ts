export interface ITheme {
  id: string
  title: string
  dates: string
  order: number

  createdAt: Date
  updatedAt: Date
}

export interface ICreateTheme {
  title: string
  dates: string
  order: number
}

export interface IUpdateTheme {
  id: string
  title?: string
  dates?: string
  order?: number
}
