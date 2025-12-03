import { ChangeEvent, ReactNode } from 'react'
import { IHero } from './entities/hero'
import { IUser } from './entities/user'
import { Errors, Inputs } from '@/app/redux/features/formSlice'

export interface ILayoutClient {
  data: { users: IUser[] | null; user: IUser | null }
  children: ReactNode
}

export interface IHeroStudioEditor {
  activeHero: IHero
  updateActiveHero: (updates: Partial<IHero>) => void
}

export interface RouteParams {
  id: string
}

export interface ILayout {
  children: ReactNode
}

export interface IForm {
  errors: Errors
  handleInput: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: { preventDefault: () => void }) => Promise<void>
  handleToggle?: (e: ChangeEvent<HTMLInputElement>) => void
  handleSelect?: (e: ChangeEvent<HTMLSelectElement>) => void
  inputs: Inputs
  isLoading: boolean
  isUpdating: boolean
  onClose: () => void
}
