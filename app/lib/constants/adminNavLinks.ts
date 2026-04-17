import {
  LucideIcon,
  Logs,
  LayoutDashboard,
  Plug,
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
  UserCircle
} from 'lucide-react'

const isStringInPath = (path: string, str: string) => path.includes(str)

export const adminNavigationLinkData = (
  path: string,
  isSuperUser: boolean
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
    },
    {
      icon: Plug,
      label: 'Integrations',
      path: '/admin/mission-control',
      description: 'Integration credentials',
      active: isStringInPath(path, 'mission-control')
    }
  ]

  const contentGroup = [
    {
      icon: Pencil,
      label: 'Page Content Editor',
      path: '/admin/star-map/home',
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
      description: 'Newsletters & Club Resources',
      active: isStringInPath(path, 'the-library')
    }
  ]

  const operationsGroup = [
    {
      icon: CalendarDays,
      label: 'Events & Raffles',
      path: '/admin/capsule/overview',
      description: 'Event Management',
      active: isStringInPath(path, 'capsule')
    },
    {
      icon: HandCoins,
      label: 'Donations',
      path: '/admin/fuel-tank/overview',
      description: 'Organize Assets',
      active: isStringInPath(path, 'fuel-tank')
    }
  ]

  const managementGroup = [
    {
      icon: Users,
      label: 'Users',
      path: '/admin/command-pod',
      description: '',
      active: isStringInPath(path, 'command-pod')
    },
    {
      icon: Mail,
      label: 'Newsletter Emails',
      path: '/admin/signal-relay',
      description: 'Manage Newsletter Subscribers',
      active: isStringInPath(path, 'signal-relay')
    },
    {
      icon: Inbox,
      label: 'Contact Submissions',
      path: '/admin/transmissions',
      description: 'Contact Form Submissions',
      active: isStringInPath(path, 'transmissions')
    },
    {
      icon: BriefcaseBusiness,
      label: 'Job Applications',
      path: '/admin/airlock',
      description: 'Pending Job Applications',
      active: isStringInPath(path, 'airlock')
    }
  ]

  const systemGroup = [
    {
      icon: GitCommit,
      label: 'Changelog',
      path: '/admin/changelog',
      description: 'Version History & Updates',
      active: isStringInPath(path, 'changelog')
    },
    ...(isSuperUser
      ? [
          {
            icon: Logs,
            label: 'Logs',
            path: '/admin/logs',
            description: 'System details',
            active: isStringInPath(path, 'logs')
          }
        ]
      : [])
  ]

  return [
    { title: 'Overview', items: dashboardGroup },
    { title: 'Operations', items: operationsGroup },
    { title: 'Management', items: managementGroup },
    { title: 'Content', items: contentGroup },
    { title: 'Profile', items: userGroup },
    { title: 'System', items: systemGroup }
  ]
}
