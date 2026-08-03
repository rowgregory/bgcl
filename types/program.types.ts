import type { Program } from '@prisma/client'
import type { AdditionalDetail, ProgramTheme } from '@/lib/validations/program.validation'

export type ProgramRecord = Omit<Program, 'descriptions' | 'themes' | 'additionalDetails'> & {
  descriptions: string[]
  themes: ProgramTheme[]
  additionalDetails: AdditionalDetail[]
}
