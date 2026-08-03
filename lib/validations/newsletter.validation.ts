import { z } from 'zod'

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const

export const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i)

export const newsletterSchema = z.object({
  month: z.enum(MONTHS, { error: 'Please select a month' }),
  year: z.coerce.number().int().gte(2000, { error: 'Enter a valid year' }).lte(2100, { error: 'Enter a valid year' }),
  pdfUrl: z.url({ error: 'Please enter a valid URL' })
})

export type NewsletterFormInput = z.input<typeof newsletterSchema>
export type NewsletterFormValues = z.output<typeof newsletterSchema>

export const EMPTY_NEWSLETTER: NewsletterFormInput = {
  month: 'January',
  year: new Date().getFullYear(),
  pdfUrl: ''
}
