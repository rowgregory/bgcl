import { ChangeEvent, ReactNode } from 'react'
import { IHero } from './entities/hero'
import { Errors, Inputs } from '@/app/lib/store/slices/formSlice'
import { ITheme } from './entities/theme'

export interface IHeroStudioEditor {
  activeHero: IHero
  updateActiveHero: (updates: Partial<IHero>) => void
}

export interface ILayout {
  children: ReactNode
}

export interface IForm {
  errors: Errors
  handleInput: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleSubmit: (e: { preventDefault: () => void }) => Promise<void>
  handleToggle?: (e: ChangeEvent<HTMLInputElement>) => void
  handleSelect?: (e: React.ChangeEvent<HTMLSelectElement> | { name: string; value: string }) => void
  inputs: Inputs
  isLoading: boolean
  isUpdating: boolean
  onClose: () => void
  handleSelectAgeGroup?: (value: string) => void
  themes?: ITheme[]
}
