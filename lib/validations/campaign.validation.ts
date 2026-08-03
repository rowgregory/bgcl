import z from 'zod'

export const campaignSchema = z.object({
  name: z.string().trim().min(1, { error: 'Please enter a valid name' }),
  description: z.string().trim().min(1, { error: 'Please enter a valid description' }),
  goalAmount: z.coerce.number().gt(0, { error: 'Please enter an amount greater than 0' }),
  currentAmount: z.coerce.number().gte(0, { error: 'Please enter an amount 0 or greater' }),
  organizerName: z.string().trim().min(1, { error: 'Please enter a valid organizer name' }),
  startDate: z.string().trim().min(1, { error: 'Please enter a valid start date' }),
  endDate: z.string().trim().nullish(),
  isActive: z.boolean().default(true),
  isListed: z.boolean().default(true),
  externalLink: z.string().trim().nullish(),
  image: z.string().trim().nullish()
})

export type CampaignFormInput = z.input<typeof campaignSchema>
export type CampaignFormValues = z.output<typeof campaignSchema>
