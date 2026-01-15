const getStarMapLinks = (path: string) => [
  {
    textKey: 'Home Page',
    linkKey: '/admin/star-map/home',
    isActive: path === '/admin/star-map/home'
  },
  {
    textKey: 'About Us',
    linkKey: '/admin/star-map/about-us',
    isActive: path === '/admin/star-map/about-us'
  },
  {
    textKey: 'Programs',
    linkKey: '/admin/star-map/programs',
    isActive: path === '/admin/star-map/programs'
  },
  {
    textKey: 'Join Our Team',
    linkKey: '/admin/star-map/join-our-team',
    isActive: path === '/admin/star-map/join-our-team'
  },
  {
    textKey: 'Events',
    linkKey: '/admin/star-map/events',
    isActive: path === '/admin/star-map/events'
  },
  {
    textKey: 'Contact',
    linkKey: '/admin/star-map/contact',
    isActive: path === '/admin/star-map/contact'
  }
]

export default getStarMapLinks
