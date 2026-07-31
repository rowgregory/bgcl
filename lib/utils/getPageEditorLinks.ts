const getPageEditorLinks = (path: string) => [
  {
    textKey: 'Home Page',
    linkKey: '/admin/page/home',
    isActive: path === '/admin/page/home'
  },
  {
    textKey: 'About',
    linkKey: '/admin/page/about',
    isActive: path === '/admin/page/about'
  },
  {
    textKey: 'Team',
    linkKey: '/admin/page/team',
    isActive: path === '/admin/page/team'
  },
  {
    textKey: 'Programs',
    linkKey: '/admin/page/programs',
    isActive: path === '/admin/page/programs'
  },
  {
    textKey: 'Campaigns',
    linkKey: '/admin/page/campaigns',
    isActive: path === '/admin/page/campaigns'
  },
  {
    textKey: 'Events',
    linkKey: '/admin/page/events',
    isActive: path === '/admin/page/events'
  },
  {
    textKey: 'Award Winners',
    linkKey: '/admin/page/award-winners',
    isActive: path === '/admin/page/award-winners'
  },
  {
    textKey: 'Latest News',
    linkKey: '/admin/page/latest-news',
    isActive: path === '/admin/page/latest-news'
  },
  {
    textKey: 'Partnerships',
    linkKey: '/admin/page/partnerships',
    isActive: path === '/admin/page/partnerships'
  },
  {
    textKey: 'Get Involved',
    linkKey: '/admin/page/get-involved',
    isActive: path === '/admin/page/get-involved'
  },
  {
    textKey: 'Contact',
    linkKey: '/admin/page/contact',
    isActive: path === '/admin/page/contact'
  },
  {
    textKey: 'Campital Campaign',
    linkKey: '/admin/page/capital-campaign',
    isActive: path === '/admin/page/capital-campaign'
  },
  {
    textKey: 'CIT Application',
    linkKey: '/admin/page/cit-application',
    isActive: path === '/admin/page/cit-application'
  }
]

export default getPageEditorLinks
