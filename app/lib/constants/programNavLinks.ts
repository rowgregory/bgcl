import { LucideIcon, DoorOpen, Orbit } from 'lucide-react'

const isStringInPath = (path: string, str: string) => path.includes(str)

export const programNavigationLinkData = (
  path: string
): {
  title: string
  items: { icon: LucideIcon; label: string; path: string; description: string; active: boolean; isDrawer?: boolean }[]
}[] => {
  // const dashboardGroup = [
  //   {
  //     icon: Rocket,
  //     label: 'Mission Control',
  //     path: '/program/mission-control',
  //     description: 'Dashboard',
  //     active: isStringInPath(path, 'mission-control')
  //   }
  // ]

  const userGroup = [
    {
      icon: Orbit,
      label: 'My Space',
      path: '/supporter/overview',
      description: 'View your profile & donations',
      active: isStringInPath(path, 'supporter/overview')
    }
  ]

  const managementGroup = [
    {
      icon: DoorOpen,
      label: 'Job Applications',
      path: '/program/job-applications',
      description: 'Job Applications',
      active: isStringInPath(path, 'airlock')
    }
  ]

  return [
    // { title: 'Dashboard', items: dashboardGroup },
    { title: 'User', items: userGroup },
    { title: 'Management', items: managementGroup }
  ]
}
