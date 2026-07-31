import { TABS } from '@/lib/constants/cit-application.constants'
import { CITApplicationStatus } from '@prisma/client'

export interface CITFormData {
  name: string
  dateOfBirth: string
  age: string
  city: string
  school: string
  grade: string
  cellPhone: string
  personalEmail: string
  parentGuardianEmail: string
  emergencyContact1: string
  emergencyContact2: string
  weeksAvailable: string[]
  strengths: string
  hopesToLearn: string
  hobbiesExtracurriculars: string
  healthFormUrl: string
  healthFormFileName: string
}

export interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
  hint?: string
  error?: string
}

export interface TextAreaFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
  rows?: number
}

export interface CITApplicationFormProps {
  t?: {
    eyebrow?: string
    heading?: string
    paragraph1?: string
    paragraph2?: string
    volunteer_link?: string
  }
}

/**
 * Input for creating a CIT application.
 *
 * Note the boundary coercions vs. the client form:
 * - `age` arrives as a number (client stores it as a string)
 * - `dateOfBirth` arrives as a Date (client stores it as an ISO string)
 *
 * DB-managed fields (`id`, `createdAt`, `updatedAt`, `status`) are omitted —
 * `status` defaults to PENDING at the schema level.
 */
export interface CreateCITApplicationInput {
  name: string
  dateOfBirth: Date
  age: number
  city: string
  school: string
  grade: string

  cellPhone: string
  personalEmail?: string | null
  parentGuardianEmail: string
  emergencyContact1: string
  emergencyContact2: string

  weeksAvailable: string[]

  strengths: string
  hopesToLearn: string
  hobbiesExtracurriculars: string

  healthFormUrl?: string | null
  healthFormFileName?: string | null
  healthFormUploadedAt?: Date | null
}

/**
 * Input for updating a single application's review status.
 */
export interface UpdateCITApplicationStatusInput {
  id: string
  status: CITApplicationStatus
}

export type Tab = (typeof TABS)[number]
