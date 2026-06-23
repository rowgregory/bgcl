'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { ContactReadStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function updateContactSubmissionStatus(id: string, status: ContactReadStatus) {
  try {
    const existingContactSubmission = await prisma.contactSubmission.findUnique({
      where: { id }
    })

    if (!existingContactSubmission) {
      await createLog('warn', 'Contact submission not found for status update', {
        contactSubmissionId: id
      })
      return { success: false, error: 'Contact submission not found', status: 404 }
    }

    const contactSubmission = await prisma.contactSubmission.update({
      where: { id },
      data: { status }
    })

    await createLog('info', 'ContactSubmission status updated successfully', {
      contactSubmissionId: contactSubmission.id,
      previousStatus: status,
      newStatus: contactSubmission.status
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update contact submission status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      contactSubmissionId: id
    })

    return {
      success: false,
      error: 'Failed to update contact submission status. Please try again.'
    }
  }
}
