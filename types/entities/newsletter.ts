export interface INewsletter {
  id: string
  month: string
  year: number
  pdfUrl: string
  order: number

  createdAt: Date
  updatedAt: Date
}
