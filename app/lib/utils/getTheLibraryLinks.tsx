export const getTheLibraryLinks = (path: string) => [
  {
    textKey: 'Programs',
    linkKey: '/admin/the-library/programs',
    isActive: path === '/admin/the-library/programs'
  },
  {
    textKey: 'Board of Directors',
    linkKey: '/admin/the-library/board-of-directors',
    isActive: path === '/admin/the-library/board-of-directors'
  },
  {
    textKey: 'Our Team',
    linkKey: '/admin/the-library/our-team',
    isActive: path === '/admin/the-library/our-team'
  },
  {
    textKey: 'Spotlight',
    linkKey: '/admin/the-library/spotlight',
    isActive: path === '/admin/the-library/spotlight'
  },
  {
    textKey: 'News',
    linkKey: '/admin/the-library/news',
    isActive: path === '/admin/the-library/news'
  },

  {
    textKey: 'Newsletters',
    linkKey: '/admin/the-library/newsletters',
    isActive: path === '/admin/the-library/newsletters'
  },
  {
    textKey: 'Club Resources',
    linkKey: '/admin/the-library/club-resources',
    isActive: path === '/admin/the-library/club-resources'
  }
]
