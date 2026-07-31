import { INewsletter } from '@/types/entities/newsletter'

export const initialNewsletterFormState: Partial<INewsletter> = {
  month: '',
  year: new Date().getFullYear(),
  pdfUrl: '',
  order: 0,
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined
}
