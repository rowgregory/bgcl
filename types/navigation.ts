import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
import { LucideIcon } from 'lucide-react'
import { Session } from 'next-auth'
import { IUser } from './entities/user'

export interface INavigationLink {
  id: string
  linkKey?: string
  label: string
  icon: LucideIcon
  description?: string
}

export interface IFixedLeftNavigationPanel {
  isNavigationCollapsed: boolean
  setIsNavigationCollapsed: (isNavigationCollapsed: boolean) => void
  selectedPage: string
  links: INavigationLink[]
  user: IUser | null
}

export interface IActionItems {
  linkKey: string
  action: string
  label: string
  icon: LucideIcon
  open: ActionCreatorWithoutPayload
  isUnlocked: boolean
}

export interface IFixedHeader {
  isNavigationCollapsed: boolean
  selectedPage: string
  links: INavigationLink[]
}
