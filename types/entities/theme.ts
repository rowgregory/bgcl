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
