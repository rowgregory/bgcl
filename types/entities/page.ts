export interface IPage {
  id: string
  slug: string
  content: []
  createBy?: string

  createdAt: Date
  updatedAt: Date
}
