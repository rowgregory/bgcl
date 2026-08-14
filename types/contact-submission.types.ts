import type { ContactSubmission } from '@prisma/client'

/**
 * The comma-delimited columns come back as strings. Compose a record type only
 * where a consumer needs them already split.
 *
 * If you migrate `availabilityDays` / `programInterests` to `String[]` in Prisma,
 * delete this and use `ContactSubmission` directly.
 */
export type ContactSubmissionRecord = Omit<ContactSubmission, 'availabilityDays' | 'programInterests'> & {
  availabilityDays: string[]
  programInterests: string[]
}

/** Admin list rows: the columns the inbox table actually renders. */
export type ContactSubmissionListItem = Pick<
  ContactSubmission,
  'id' | 'firstName' | 'lastName' | 'email' | 'type' | 'status' | 'createdAt'
>
