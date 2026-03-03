export const getTheFuelTankNavLinks = (path: string) => [
  {
    textKey: 'Overview',
    linkKey: '/admin/fuel-tank/overview',
    isActive: path === '/admin/fuel-tank/overview'
  },
  {
    textKey: 'Campaigns',
    linkKey: '/admin/fuel-tank/campaigns',
    isActive: path === '/admin/fuel-tank/campaigns'
  },
  {
    textKey: 'Transactions',
    linkKey: '/admin/fuel-tank/transactions',
    isActive: path === '/admin/fuel-tank/transactions'
  }
]
