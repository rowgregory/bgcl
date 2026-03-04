export const getCapsuleNavLinks = (path: string) => [
  {
    textKey: 'Overview',
    linkKey: '/admin/capsule/overview',
    isActive: path === '/admin/capsule/overview'
  },
  {
    textKey: 'Events',
    linkKey: '/admin/capsule/events',
    isActive: path === '/admin/capsule/events'
  },
  {
    textKey: 'Transactions',
    linkKey: '/admin/capsule/transactions',
    isActive: path === '/admin/capsule/transactions'
  },
  {
    textKey: 'Manifest',
    linkKey: '/admin/capsule/manifest',
    isActive: path === '/admin/capsule/manifest'
  }
]
