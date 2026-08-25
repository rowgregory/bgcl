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
import { PROGRAM_PATHS } from '../constants/auth.constants'

const isStringInPath = (path: string, str: string) => path.includes(str)

export const adminNavigationLinkData = (
  path: string,
  role?: Role
): {
  title: string
  items: { icon: LucideIcon; label: string; path: string; description: string; active: boolean }[]
}[] => {
  const userGroup = [
    {
      icon: UserCircle,
      label: 'Supporter Overview',
      path: '/supporter/overview',
      description: 'View your profile & donations',
      active: isStringInPath(path, 'supporter/overview')
    }
  ]

  const dashboardGroup = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin/dashboard',
      description: 'Key Performance Indicators',
      active: isStringInPath(path, 'dashboard')
    }
  ]

  const contentGroup = [
    {
      icon: Pencil,
      label: 'Page Content Editor',
      path: '/admin/page/home',
      description: 'Public Site Content',
      active: isStringInPath(path, 'star-map')
    },
    {
      icon: Image,
      label: 'Hero Studio',
      path: '/admin/hero',
      description: 'Hero Studio & Campaign Visuals',
      active: isStringInPath(path, 'hero')
    },
    {
      icon: Library,
      label: 'The Library',
      path: '/admin/the-library/programs',
      description: 'Newsletters & Resources',
      active: isStringInPath(path, 'the-library')
    }
  ]

  const operationsGroup = [
    {
      icon: CalendarDays,
      label: 'Events & Raffles',
      path: '/admin/events/overview',
      description: 'Event Management',
      active: isStringInPath(path, 'events')
    },
    {
      icon: HandCoins,
      label: 'Donations',
      path: '/admin/donations/overview',
      description: 'Organize Assets',
      active: isStringInPath(path, 'donations')
    }
  ]

  const managementGroup = [
    {
      icon: Users,
      label: 'Users',
      path: '/admin/users',
      description: '',
      active: isStringInPath(path, 'command-pod')
    },
    {
      icon: Mail,
      label: 'Newsletter Emails',
      path: '/admin/newsletter-emails',
      description: 'Manage Newsletter Subscribers',
      active: isStringInPath(path, 'newsletter-emails')
    },
    {
      icon: Inbox,
      label: 'Contact Submissions',
      path: '/admin/contact-submissions',
      description: 'Contact Form Submissions',
      active: isStringInPath(path, 'contact-submissions')
    },
    {
      icon: BriefcaseBusiness,
      label: 'Job Applications',
      path: '/admin/job-applications',
      description: 'Pending Job Applications',
      active: isStringInPath(path, 'job-applications')
    },
    {
      icon: FileText,
      label: 'CIT Applications',
      path: '/admin/cit-applications',
      description: 'Pending CIT Applications',
      active: isStringInPath(path, 'cit-applications')
    }
  ]

  const systemGroup = [
    {
      icon: GitCommit,
      label: 'Changelog',
      path: '/admin/changelog',
      description: 'Version History & Updates',
      active: isStringInPath(path, 'changelog')
    }
  ]

  const groups = [
    { title: 'Overview', items: dashboardGroup },
    { title: 'Operations', items: operationsGroup },
    { title: 'Management', items: managementGroup },
    { title: 'Content', items: contentGroup },
    { title: 'Profile', items: userGroup },
    { title: 'System', items: systemGroup }
  ]

  if (role !== 'PROGRAM') return groups

  return groups
    .map((group) => ({ ...group, items: group.items.filter((item) => PROGRAM_PATHS.includes(item.path)) }))
    .filter((group) => group.items.length > 0)
}
