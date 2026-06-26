export const ONE_TIME_PLANS = [
  {
    id: 'once_friend',
    name: 'Friend',
    amount: 50,
    description: 'Help us today',
    features: ['Thank you email', 'Tax receipt']
  },
  {
    id: 'once_supporter',
    name: 'Supporter',
    amount: 100,
    description: 'Make an impact',
    features: ['Thank you email', 'Tax receipt', 'Donor recognition (optional)']
  },
  {
    id: 'once_champion',
    name: 'Champion',
    amount: 250,
    description: 'Change lives',
    features: ['Thank you email', 'Tax receipt', 'Donor recognition', 'Impact update'],
    highlighted: true
  },
  {
    id: 'once_hero',
    name: 'Hero',
    amount: 500,
    description: 'Transform futures',
    features: ['Thank you email', 'Tax receipt', 'Donor recognition', 'Impact update', 'Personal thank you call']
  },
  {
    id: 'once_benefactor',
    name: 'Benefactor',
    amount: 1000,
    description: 'Create lasting change',
    features: [
      'Thank you email',
      'Tax receipt',
      'Donor recognition',
      'Impact update',
      'Personal thank you call',
      'Special recognition on website'
    ]
  },
  {
    id: 'once-custom',
    name: 'Custom Amount',
    amount: 0,
    description: 'Choose your own amount'
  }
]

export const MONTHLY_PLANS = [
  {
    id: 'monthly_supporter',
    name: 'Supporter',
    amount: 250,
    description: 'Support our monthly programs',
    features: ['Monthly impact report', 'Donor recognition (optional)']
  },
  {
    id: 'monthly_champion',
    name: 'Champion',
    amount: 500,
    description: 'Make a bigger difference',
    features: ['Monthly impact report', 'Donor recognition', 'Exclusive updates'],
    highlighted: true
  },
  {
    id: 'monthly_leader',
    name: 'Leader',
    amount: 1000,
    description: 'Lead lasting change',
    features: ['Monthly impact report', 'Donor recognition', 'Exclusive updates', 'Annual thank you event']
  },
  {
    id: 'monthly_founder',
    name: 'Founder',
    amount: 2500,
    description: 'Transform the community',
    features: [
      'Monthly impact report',
      'Donor recognition',
      'Exclusive updates',
      'Annual thank you event',
      'Board meeting invitations',
      'Naming opportunity'
    ]
  },
  { id: 'monthly-custom', name: 'Custom Amount', amount: 0, description: 'Choose your own amount' } // Add this
]

export const YEARLY_PLANS = [
  { id: 'yearly-3000', name: 'Supporter', description: 'Annual support for our mission', amount: 3000 },
  { id: 'yearly-6000', name: 'Champion', description: 'Sustained commitment to youth', amount: 6000 },
  { id: 'yearly-12000', name: 'Hero', description: 'Major annual investment', amount: 12000 },
  { id: 'yearly-custom', name: 'Custom Amount', amount: 0, description: 'Choose your own amount' }
]
