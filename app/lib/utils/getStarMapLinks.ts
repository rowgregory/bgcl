const getStarMapLinks = (path: string) => [
  {
    textKey: 'Home Page',
    linkKey: '/admin/star-map/home',
    isActive: path === '/admin/star-map/home'
  },
  {
    textKey: 'About',
    linkKey: '/admin/star-map/about',
    isActive: path === '/admin/star-map/about'
  },
  {
    textKey: 'Team',
    linkKey: '/admin/star-map/team',
    isActive: path === '/admin/star-map/team'
  },
  {
    textKey: 'Programs',
    linkKey: '/admin/star-map/programs',
    isActive: path === '/admin/star-map/programs'
  },
  {
    textKey: 'Campaigns',
    linkKey: '/admin/star-map/campaigns',
    isActive: path === '/admin/star-map/campaigns'
  },
  {
    textKey: 'Events',
    linkKey: '/admin/star-map/events',
    isActive: path === '/admin/star-map/events'
  },
  {
    textKey: 'Award Winners',
    linkKey: '/admin/star-map/award-winners',
    isActive: path === '/admin/star-map/award-winners'
  },
  {
    textKey: 'Latest News',
    linkKey: '/admin/star-map/latest-news',
    isActive: path === '/admin/star-map/latest-news'
  },
  {
    textKey: 'Partnerships',
    linkKey: '/admin/star-map/partnerships',
    isActive: path === '/admin/star-map/partnerships'
  },
  {
    textKey: 'Get Involved',
    linkKey: '/admin/star-map/get-involved',
    isActive: path === '/admin/star-map/get-involved'
  },
  {
    textKey: 'Contact',
    linkKey: '/admin/star-map/contact',
    isActive: path === '/admin/star-map/contact'
  },
  {
    textKey: 'Campital Campaign',
    linkKey: '/admin/star-map/capital-campaign',
    isActive: path === '/admin/star-map/capital-campaign'
  }
]

export default getStarMapLinks
