import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
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

export interface SubMenuItem {
  action: string
  label: string
  icon: LucideIcon
  open: any
  formName: string
  initial: any
  isUnlocked: boolean
}

export interface IActionItems {
  linkKey?: string
  action: string
  label: string
  icon: LucideIcon
  open?: ActionCreatorWithoutPayload
  isUnlocked: boolean
  hasSubmenu?: boolean
  submenu?: SubMenuItem[]
}
