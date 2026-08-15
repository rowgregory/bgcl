'use server'

import type { ContactSubmissionType, Prisma } from '@prisma/client'

import prisma from '@/prisma/client'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'
import sendAdminNotification from '../../utils/sendAdminNotification'
import { createLog } from '../log/createLog'
import { getActor } from '../user/getActor'
import {
  CONTACT_SUBMISSION_NULLABLE_FIELDS,
  contactSubmissionSchema,
  VOLUNTEER_SUBMISSION_NULLABLE_FIELDS,
  volunteerSubmissionSchema
} from '@/lib/validations/contact-submission.validation'
import { emptyToNull } from '@/lib/utils/emptyToNull'

export const createContactSubmission = async (type: ContactSubmissionType, input: unknown) => {
  const parsed =
    type === 'VOLUNTEER' ? volunteerSubmissionSchema.safeParse(input) : contactSubmissionSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid submission data'
    }
  }

  const data = parsed.data

  // The volunteer branch carries the extra columns. `status` defaults to NEW in Prisma.
  const createData: Prisma.ContactSubmissionUncheckedCreateInput =
    'availabilityDays' in data
      ? {
          ...emptyToNull(data, VOLUNTEER_SUBMISSION_NULLABLE_FIELDS),
          type,
          availabilityDays: data.availabilityDays.join(','),
          programInterests: data.programInterests.join(','),
          yearsExperience: data.yearsExperience ? Number(data.yearsExperience) : null
        }
      : {
          ...emptyToNull(data, CONTACT_SUBMISSION_NULLABLE_FIELDS),
          type
        }

  try {
    const submission = await prisma.contactSubmission.create({ data: createData })

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = await buildLogMessage('submitted a contact form', actor, context)

    await createLog('info', message, {
      submissionId: submission.id,
      type,
      email: submission.email,
      ...context
    })

    // A failed notification shouldn't fail the submission
    try {
      await sendAdminNotification(type === 'VOLUNTEER' ? 'VOLUNTEER_FORM' : 'CONTACT_FORM', {
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email
      })
    } catch (emailError) {
      await createLog('error', 'Failed to send admin notification', {
        submissionId: submission.id,
        type,
        error: emailError instanceof Error ? emailError.message : 'Unknown error'
      })
    }

    return { success: true, data: submission }
  } catch (error) {
    await createLog('error', 'Failed to create contact submission', {
      type,
      email: data.email,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to submit. Please try again.' }
  }
}
