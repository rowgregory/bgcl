export interface CreateSubscriberInput {
  email: string
  type: 'member' | 'non-member' | 'donor'
}
