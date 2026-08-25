import { PROGRAM_PATHS } from '@/lib/constants/auth.constants'
import { Role } from '@prisma/client'
import {
  LucideIcon,
  LayoutDashboard,
  Pencil,
  Image,
  Library,
  CalendarDays,
  HandCoins,
  Users,
  Mail,
  Inbox,
  BriefcaseBusiness,
  GitCommit,
  UserCircle,
  FileText
} from 'lucide-react'

export type NavChild = { label: string; path: string; active: boolean }

export type NavItem = {
  icon: LucideIcon
  label: string
  path: string
  section?: string
  active: boolean
  inSection: boolean
  children?: NavChild[]
}

export const adminNavigationLinkData = (path: string, role?: Role): { title: string; items: NavItem[] }[] => {
  const child = (label: string, childPath: string): NavChild => ({
    label,
    path: childPath,
    active: path === childPath
  })

  const item = (
    icon: LucideIcon,
    label: string,
    itemPath: string,
    children?: NavChild[],
    section?: string
  ): NavItem => ({
    icon,
    label,
    path: itemPath,
    section,
    children,
    active: section ? false : path.startsWith(itemPath),
    inSection: section ? path.startsWith(section) : path.startsWith(itemPath)
  })

  const groups = [
    {
      title: 'Overview',
      items: [item(LayoutDashboard, 'Dashboard', '/admin/dashboard')]
    },
    {
      title: 'Operations',
      items: [
        item(
          CalendarDays,
          'Events',
          '/admin/events/overview',
          [
            child('Overview', '/admin/events/overview'),
            child('Transactions', '/admin/events/transactions'),
            child('Events', '/admin/events/events'),
            child('Manifest', '/admin/events/manifest'),
            child('Archive', '/admin/events/archive')
          ],
          '/admin/events'
        ),
        item(
          HandCoins,
          'Donations',
          '/admin/donations/overview',
          [
            child('Overview', '/admin/donations/overview'),
            child('Transactions', '/admin/donations/transactions'),
            child('Campaigns', '/admin/donations/campaigns')
          ],
          '/admin/donations'
        )
      ]
    },
    {
      title: 'Content',
      items: [
        item(
          Pencil,
          'Page Editor',
          '/admin/page/home',
          [
            child('Home', '/admin/page/home'),
            child('About', '/admin/page/about'),
            child('Team', '/admin/page/team'),
            child('Programs', '/admin/page/programs'),
            child('Campaigns', '/admin/page/campaigns'),
            child('Events', '/admin/page/events'),
            child('Award Winners', '/admin/page/award-winners'),
            child('Latest News', '/admin/page/latest-news'),
            child('Partnerships', '/admin/page/partnerships'),
            child('Get Involved', '/admin/page/get-involved'),
            child('Contact', '/admin/page/contact'),
            child('Capital Campaign', '/admin/page/capital-campaign'),
            child('CIT Application', '/admin/page/cit-application')
          ],
          '/admin/page'
        ),
        item(Image, 'Hero Studio', '/admin/hero'),
        item(
          Library,
          'The Library',
          '/admin/the-library/programs',
          [
            child('Programs', '/admin/the-library/programs'),
            child('Board of Directors', '/admin/the-library/board-of-directors'),
            child('Our Team', '/admin/the-library/our-team'),
            child('Spotlight', '/admin/the-library/spotlight'),
            child('News', '/admin/the-library/news'),
            child('Newsletters', '/admin/the-library/newsletters'),
            child('Resources', '/admin/the-library/resources'),
            child('Closings', '/admin/the-library/closings'),
            child('Partners', '/admin/the-library/partners')
          ],
          '/admin/the-library'
        )
      ]
    },
    {
      title: 'Management',
      items: [
        item(Users, 'Users', '/admin/users'),
        item(Mail, 'Newsletter Emails', '/admin/newsletter-emails'),
        item(Inbox, 'Contact Submissions', '/admin/contact-submissions'),
        item(BriefcaseBusiness, 'Job Applications', '/admin/job-applications'),
        item(FileText, 'CIT Applications', '/admin/cit-applications')
      ]
    },
    {
      title: 'Profile',
      items: [item(UserCircle, 'Supporter Overview', '/supporter/overview')]
    },
    {
      title: 'System',
      items: [item(GitCommit, 'Changelog', '/admin/changelog')]
    }
  ]

  if (role !== 'PROGRAM') return groups

  return groups
    .map((group) => ({ ...group, items: group.items.filter((i) => PROGRAM_PATHS.includes(i.path)) }))
    .filter((group) => group.items.length > 0)
}
