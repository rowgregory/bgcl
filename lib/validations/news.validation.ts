import { z } from 'zod'

export const newsSchema = z.object({
  title: z.string().trim().min(1, { error: 'Please enter a valid news title' }),
  image: z.string().trim().nullish(),
  paragraph1: z.string().trim().nullish(),
  paragraph2: z.string().trim().nullish(),
  paragraph3: z.string().trim().nullish(),
  externalLink: z.string().trim().nullish()
})

export type NewsFormInput = z.input<typeof newsSchema>
export type NewsFormValues = z.output<typeof newsSchema>

export const EMPTY_NEWS: Partial<NewsFormInput> = {
  title: '',
  image: '',
  paragraph1: '',
  paragraph2: '',
  paragraph3: '',
  externalLink: ''
}
