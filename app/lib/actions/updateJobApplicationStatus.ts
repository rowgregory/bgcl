'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { revalidatePath } from 'next/cache'

type JobApplicationStatus = 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED'

export async function updateJobApplicationStatus(id: string, status: JobApplicationStatus) {
  try {
    const jobApplication = await prisma.jobApplication.findUnique({
      where: { id }
    })

    if (!jobApplication) {
      return { success: false, error: 'Job application not found', status: 404 }
    }

    const updatedJobApplication = await prisma.jobApplication.update({
      where: { id },
      data: { status }
    })

    revalidatePath('/', 'layout')

    return { success: true, jobApplication: updatedJobApplication }
  } catch (error) {
    await createLog('error', 'Failed to update job application status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      jobApplicationId: id
    })

    return {
      success: false,
      error: 'Failed to update job application status. Please try again.'
    }
  }
}
