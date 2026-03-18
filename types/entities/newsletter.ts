export interface INewsletter {
  id: string
  month: string
  year: number
  pdfUrl: string
  order: number

  createdAt: Date
  updatedAt: Date
}

export interface UpdateNewsletterInput {
  id: string
  month: string
  year: number
  pdfUrl: string
  order: number
}

export interface CreateNewsletterInput {
  month: string
  year: number
  pdfUrl: string
  order: number
}
