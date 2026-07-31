export const getDonationsNavLinks = (path: string) => [
  {
    textKey: 'Overview',
    linkKey: '/admin/donations/overview',
    isActive: path === '/admin/donations/overview'
  },
  {
    textKey: 'Campaigns',
    linkKey: '/admin/donations/campaigns',
    isActive: path === '/admin/donations/campaigns'
  },
  {
    textKey: 'Transactions',
    linkKey: '/admin/donations/transactions',
    isActive: path === '/admin/donations/transactions'
  }
]
