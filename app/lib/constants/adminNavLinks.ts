import {
  Globe,
  Shield,
  Fuel,
  BookOpen,
  GitCommit,
  Radio,
  LucideIcon,
  MessageSquare,
  DoorOpen,
  Orbit,
  Logs,
  Rocket,
  Satellite,
  Aperture,
  KeyRound
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
      icon: Orbit,
      label: 'Supporter Overview',
      path: '/supporter/overview',
      description: 'View your profile & donations',
      active: isStringInPath(path, 'supporter/overview')
    }
  ]

  const dashboardGroup = [
    {
      icon: KeyRound,
      label: 'Integrations',
      path: '/admin/mission-control',
      description: 'Integration credentials',
      active: isStringInPath(path, 'mission-control')
    }
  ]

  const contentGroup = [
    {
      icon: Globe,
      label: 'Page Content Editor',
      path: '/admin/star-map/home',
      description: 'Public Site Content',
      active: isStringInPath(path, 'star-map')
    },
    {
      icon: Aperture,
      label: 'Hero Studio',
      path: '/admin/hero',
      description: 'Hero Studio & Campaign Visuals',
      active: isStringInPath(path, 'hero')
    },
    {
      icon: BookOpen,
      label: 'The Library',
      path: '/admin/the-library/programs',
      description: 'Newsletters & Club Resources',
      active: isStringInPath(path, 'the-library')
    }
  ]

  const operationsGroup = [
    {
      icon: Satellite,
      label: 'Events & Raffles',
      path: '/admin/capsule/overview',
      description: 'Event Management',
      active: isStringInPath(path, 'capsule')
    },
    {
      icon: Fuel,
      label: 'Donations',
      path: '/admin/fuel-tank/overview',
      description: 'Organize Assets',
      active: isStringInPath(path, 'fuel-tank')
    }
  ]

  const managementGroup = [
    {
      icon: Shield,
      label: 'Users',
      path: '/admin/command-pod',
      description: '',
      active: isStringInPath(path, 'command-pod')
    },
    {
      icon: Radio,
      label: 'Newsletter Emails',
      path: '/admin/signal-relay',
      description: 'Manage Newsletter Subscribers',
      active: isStringInPath(path, 'signal-relay')
    },
    {
      icon: MessageSquare,
      label: 'Contact Submissions',
      path: '/admin/transmissions',
      description: 'Contact Form Submissions',
      active: isStringInPath(path, 'transmissions')
    },
    {
      icon: DoorOpen,
      label: 'Job Applications',
      path: '/admin/airlock',
      description: 'Pending Job Applications',
      active: isStringInPath(path, 'airlock')
    }
    // {
    //   icon: Sliders,
    //   label: 'Operation Panel',
    //   path: '/admin/operations-panel',
    //   description: 'System Settings',
    //   active: isStringInPath(path, 'operations-panel')
    // },
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

  // const futureGroup = [
  //   {
  //     icon: ScanLine,
  //     label: 'Cryo Chamber',
  //     path: '/admin/cryo-chamber',
  //     description: 'Future features in stasis',
  //     active: isStringInPath(path, 'cryo-chamber')
  //   }
  // ]

  return [
    { title: 'Dashboard', items: dashboardGroup },
    { title: 'Operations', items: operationsGroup },
    { title: 'Management', items: managementGroup },
    { title: 'Content', items: contentGroup },
    { title: 'User', items: userGroup },
    { title: 'System', items: systemGroup }
    // { title: 'Future', items: futureGroup }
  ]
}
