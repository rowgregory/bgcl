export const SUBSCRIBER_TYPES = ['member', 'non-member', 'donor'] as const
export type SubscriberType = (typeof SUBSCRIBER_TYPES)[number]

export const SUBSCRIBER_TYPE_OPTIONS: { value: SubscriberType; label: string }[] = [
  { value: 'member', label: 'Member/Parent' },
  { value: 'non-member', label: 'Non-Member' },
  { value: 'donor', label: 'Donor' }
]
