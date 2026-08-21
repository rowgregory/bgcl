'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deleteContactSubmission(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const contactSubmission = await prisma.contactSubmission.findUnique({
      where: { id },
      select: { id: true, firstName: true, lastName: true, email: true }
    })

    if (!contactSubmission) {
      return {
        success: false,
        data: null,
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

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete contact submission', {
      error: error instanceof Error ? error.message : 'Unknown error',
      contactSubmissionId: id
    })

    return {
      success: false,
      data: null,
      error: 'Failed to delete contact submission. Please try again.'
    }
  }
}
