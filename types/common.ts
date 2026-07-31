import { ChangeEvent, ReactNode } from 'react'
import { Errors, Inputs } from '@/lib/store/slices/formSlice'
import { ITheme } from './entities/theme'

export interface ILayout {
  children: ReactNode
  themes?: ITheme[]
  isModalEnabled?: boolean
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
  themes?: { id?: string; title: string; dates: string; order: number; createdAt: Date; updatedAt: Date }[]
}

export interface PageField {
  id: string // Unique identifier
  section: string // Which section it belongs to (for grouping)
  label: string // Display name
  value: string | string[] // The actual content
  type: 'text' | 'textarea' | 'url' | 'array' | 'boolean'
}

/**
 * Standard server action return shape used across the studio.
 */
export type ActionResult<T = void> =
  | (void extends T ? { success: true; data?: undefined } : { success: true; data: T })
  | { success: false; error: string }
