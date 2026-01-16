import { Rocket, Globe, Satellite, Sliders, ScanLine, Shield, Fuel, Aperture, BookOpen, GitCommit } from 'lucide-react'

const isStringInPath = (path: string, str: string) => path.includes(str)

export const adminNavigationLinkData = (path: string) => {
  const dashboardGroup = [
    {
      icon: Rocket,
      label: 'Mission Control',
      path: '/admin/mission-control',
      description: 'Dashboard',
      active: isStringInPath(path, 'mission-control')
    }
  ]

  const contentGroup = [
    {
      icon: Globe,
      label: 'Star Map',
      path: '/admin/star-map/home',
      description: 'Public Site Content',
      active: isStringInPath(path, 'star-map')
    },
    {
      icon: Aperture,
      label: 'The Orbital Deck',
      description: 'Hero Studio & Campaign Visuals',
      isDrawer: true
    },
    {
      icon: BookOpen, // or Archive, BookOpen, Library, Download
      label: 'The Library',
      path: '/admin/the-library/programs',
      description: 'Newsletters & Club Resources',
      active: isStringInPath(path, 'the-library')
    }
  ]

  const operationsGroup = [
    {
      icon: Satellite,
      label: 'The Capsule',
      path: '/admin/capsule/core',
      description: 'Event Management',
      active: isStringInPath(path, 'capsule')
    },
    {
      icon: Fuel,
      label: 'The Fuel Tank',
      path: '/admin/fuel-tank/overview',
      description: 'Organize Assets',
      active: isStringInPath(path, 'fuel-tank')
    }
  ]

  const managementGroup = [
    {
      icon: Shield,
      label: 'Command Pod',
      path: '/admin/command-pod',
      description: '',
      active: isStringInPath(path, 'command-pod')
    },
    {
      icon: Sliders,
      label: 'Operation Panel',
      path: '/admin/operations-panel',
      description: 'System Settings',
      active: isStringInPath(path, 'operations-panel')
    },
    {
      icon: GitCommit,
      label: 'Changelog',
      path: '/admin/changelog',
      description: 'Version History & Updates',
      active: isStringInPath(path, 'changelog')
    }
  ]

  const futureGroup = [
    {
      icon: ScanLine,
      label: 'Cryo Chamber',
      path: '/admin/cryo-chamber',
      description: 'Future features in stasis',
      active: isStringInPath(path, 'cryo-chamber')
    }
  ]

  return [
    { title: 'Dashboard', items: dashboardGroup },
    { title: 'Content', items: contentGroup },
    { title: 'Operations', items: operationsGroup },
    { title: 'Management', items: managementGroup },
    { title: 'Future', items: futureGroup }
  ]
}
