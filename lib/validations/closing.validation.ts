import { z } from 'zod'

export const closingSchema = z.object({
  title: z.string().trim().min(1, { error: 'Please enter a title' }),
  date: z.string().trim().min(1, { error: 'Please enter a date' })
})

export type ClosingFormInput = z.input<typeof closingSchema>
export type ClosingFormValues = z.output<typeof closingSchema>

export const EMPTY_CLOSING: Partial<ClosingFormInput> = {
  title: '',
  date: ''
}
