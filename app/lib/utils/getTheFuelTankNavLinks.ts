const getTheFuelTankNavLinks = (path: string) => [
  {
    textKey: 'Overview',
    linkKey: '/admin/fuel-tank/overview',
    isActive: path === '/admin/fuel-tank/overview'
  },
  {
    textKey: '1x',
    linkKey: '/admin/fuel-tank/one-time',
    isActive: path === '/admin/fuel-tank/one-time'
  },
  {
    textKey: 'Monthly',
    linkKey: '/admin/fuel-tank/monthly',
    isActive: path === '/admin/fuel-tank/monthly'
  },
  {
    textKey: 'Yearly',
    linkKey: '/admin/fuel-tank/yearly',
    isActive: path === '/admin/fuel-tank/yearly'
  }
]

export default getTheFuelTankNavLinks
