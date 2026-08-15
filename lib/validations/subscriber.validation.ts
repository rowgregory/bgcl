import { z } from 'zod'

export const SUBSCRIBER_TYPES = ['member', 'donor', 'non-member'] as const
export type SubscriberType = (typeof SUBSCRIBER_TYPES)[number]

export const subscriberSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
  type: z.enum(SUBSCRIBER_TYPES, { error: 'Please choose an option' })
})

export type SubscriberFormInput = z.input<typeof subscriberSchema>
export type SubscriberFormValues = z.output<typeof subscriberSchema>

export const EMPTY_SUBSCRIBER: SubscriberFormInput = { email: '', type: 'member' }

export const SUBSCRIBER_NULLABLE_FIELDS = [] as const
