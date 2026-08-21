'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

type JobApplicationStatus = 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED'

export async function updateJobApplicationStatus(id: string, status: JobApplicationStatus) {
  const auth = await requireAdmin({ allowProgram: true })
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const jobApplication = await prisma.jobApplication.findUnique({
      where: { id }
    })

    if (!jobApplication) return { success: false, data: null, error: 'Job application not found' }

    await prisma.jobApplication.update({
      where: { id },
      data: { status }
    })

    revalidatePath('/', 'layout')

    return { success: true, error: null }
  } catch (error) {
    await createLog('error', 'Failed to update job application status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      jobApplicationId: id
    })

    return {
      success: false,
      data: null,
      error: 'Could not update job application status.'
    }
  }
}
