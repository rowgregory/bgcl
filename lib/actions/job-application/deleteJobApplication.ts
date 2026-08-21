'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deleteJobApplication(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id },
      select: { id: true, applicantName: true, email: true }
    })

    if (!application) {
      return {
        success: false,
        data: null,
        error: 'Job application not found'
      }
    }

    await prisma.jobApplication.delete({
      where: { id }
    })

    await createLog('info', 'Job application deleted', {
      applicationId: id,
      applicantName: application.applicantName,
      email: application.email
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete job application', {
      error: error instanceof Error ? error.message : 'Unknown error',
      applicationId: id
    })

    return {
      success: false,
      data: null,
      error: 'Failed to delete job application. Please try again.'
    }
  }
}
