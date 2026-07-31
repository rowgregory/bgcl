import { LucideIcon } from 'lucide-react'
import { IUser } from './entities/user'

export interface INavigationLink {
  id: string
  linkKey?: string
  label: string
  icon: LucideIcon
  description?: string
}

export interface IAdminSidebar {
  isNavigationCollapsed: boolean
  setIsNavigationCollapsed: (isNavigationCollapsed: boolean) => void
  selectedPage: string
  links: INavigationLink[]
  user: IUser | null
}
