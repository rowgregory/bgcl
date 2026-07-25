export const getEventsNavLinks = (path: string) => [
  {
    textKey: 'Overview',
    linkKey: '/admin/events/overview',
    isActive: path === '/admin/events/overview'
  },
  {
    textKey: 'Events',
    linkKey: '/admin/events/events',
    isActive: path === '/admin/events/events'
  },
  {
    textKey: 'Transactions',
    linkKey: '/admin/events/transactions',
    isActive: path === '/admin/events/transactions'
  },
  {
    textKey: 'Manifest',
    linkKey: '/admin/events/manifest',
    isActive: path === '/admin/events/manifest'
  },
  {
    textKey: 'Archive',
    linkKey: '/admin/events/archive',
    isActive: path === '/admin/events/archive'
  }
]
