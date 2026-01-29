'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export async function deleteContactSubmission(id: string) {
  try {
    const contactSubmission = await prisma.contactSubmission.findUnique({
      where: { id },
      select: { id: true, firstName: true, lastName: true, email: true }
    })

    if (!contactSubmission) {
      return {
        success: false,
        error: 'Contact submission not found'
      }
    }

    await prisma.contactSubmission.delete({
      where: { id }
    })

    await createLog('info', 'Contact submission deleted', {
      contactSubmissionId: id,
      email: contactSubmission.email,
      firstName: contactSubmission.firstName,
      lastName: contactSubmission.lastName
    })

    revalidateTag('Contact-Submission', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete contact submission', {
      error: error instanceof Error ? error.message : 'Unknown error',
      contactSubmissionId: id
    })

    return {
      success: false,
      error: 'Failed to delete contact submission. Please try again.'
    }
  }
}
