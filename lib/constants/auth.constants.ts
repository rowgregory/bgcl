export const URL_REDIRECTS: Record<string, string> = {
  '/our-team': '/team',
  '/join-our-team': '/get-involved',
  '/our-history': '/about#history',
  '/contact-us': '/contact',
  '/news-events/newsletter': '/latest-news'
}

export const PROGRAM_PATHS = ['/admin/cit-applications', '/admin/job-applications', '/supporter/overview']

export const PROGRAM_HOME = '/admin/job-applications'

export const ROLE_HOME: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  SUPERUSER: '/admin/dashboard',
  PROGRAM: '/admin/job-applications',
  SUPPORTER: '/supporter/overview'
}

export const DEFAULT_HOME = '/supporter/overview'
