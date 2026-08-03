import type { JobApplication, Reference } from '@prisma/client'

// The DB record with its relations — for reading (admin drawer, detail pages)
export type JobApplicationWithReferences = JobApplication & {
  references: Reference[]
}
