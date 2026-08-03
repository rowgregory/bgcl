import { z } from 'zod'

export const resourceSchema = z.object({
  title: z.string().trim().min(1, { error: 'Please enter a title' }),
  url: z.url({ error: 'Please enter a valid URL' })
})

export type ResourceFormInput = z.input<typeof resourceSchema>
export type ResourceFormValues = z.output<typeof resourceSchema>

export const EMPTY_RESOURCE: Partial<ResourceFormInput> = {
  title: '',
  url: ''
}
