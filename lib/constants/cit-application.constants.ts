import type { CITFormData, Tab } from '@/types/entities/cit-application.types'
import { CITApplicationStatus } from '@prisma/client'

export const WEEK_OPTIONS = [
  'Week 1: 06/22 - 06/26',
  'Week 2: 06/29 - 07/03',
  'Week 3: 07/06 - 07/10',
  'Week 4: 07/13 - 07/17',
  'Week 5: 07/20 - 07/24',
  'Week 6: 07/27 - 07/31',
  'Week 7: 08/03 - 08/07',
  'Week 8: 08/10 - 08/14'
] as const

export const INITIAL_DATA: CITFormData = {
  name: '',
  dateOfBirth: '',
  age: '',
  city: '',
  school: '',
  grade: '',
  cellPhone: '',
  personalEmail: '',
  parentGuardianEmail: '',
  emergencyContact1: '',
  emergencyContact2: '',
  weeksAvailable: [],
  strengths: '',
  hopesToLearn: '',
  hobbiesExtracurriculars: '',
  healthFormUrl: '',
  healthFormFileName: ''
}

export const FORM_STEPS = [
  { id: 1, name: 'Applicant Info' },
  { id: 2, name: 'Contact & Emergency' },
  { id: 3, name: 'Availability' },
  { id: 4, name: 'About You' }
] as const

/**
 * Public-facing application route. Revalidated after a successful create so any
 * cached confirmation/landing content reflects the new submission if needed.
 */
export const CIT_APPLICATION_PATH = '/cit-application'

/**
 * Admin review surface. Revalidated after create and status updates so the
 * admin list/detail views stay fresh without a manual refresh.
 */
export const CIT_ADMIN_PATH = '/admin/cit-applications'

/**
 * Canonical list of valid statuses, derived to mirror the Prisma enum.
 * Used to guard the status-update action against invalid input.
 */
export const CIT_APPLICATION_STATUSES: readonly CITApplicationStatus[] = [
  'PENDING',
  'REVIEWED',
  'ACCEPTED',
  'REJECTED'
] as const

export const TABS = ['All', 'PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'] as const

export const TAB_LABELS: Record<Tab, string> = {
  All: 'All',
  PENDING: 'New',
  REVIEWED: 'Reviewing',
  ACCEPTED: 'Approved',
  REJECTED: 'Rejected'
}

export const STATUS_STYLES: Record<CITApplicationStatus, string> = {
  PENDING: 'dark:bg-amber-500/15 dark:text-amber-400 bg-amber-100 text-amber-700',
  REVIEWED: 'dark:bg-sky-500/15 dark:text-sky-400 bg-sky-100 text-sky-700',
  ACCEPTED: 'dark:bg-emerald-500/15 dark:text-emerald-400 bg-emerald-100 text-emerald-700',
  REJECTED: 'dark:bg-red-500/15 dark:text-red-400 bg-red-100 text-red-700'
}

export const ACTIVE_STATUS_STYLES: Record<CITApplicationStatus, string> = {
  PENDING: 'bg-amber-600 text-white border-transparent',
  REVIEWED: 'bg-sky-600 text-white border-transparent',
  ACCEPTED: 'bg-emerald-600 text-white border-transparent',
  REJECTED: 'bg-red-600 text-white border-transparent'
}

export const INACTIVE_STATUS_STYLES =
  'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
