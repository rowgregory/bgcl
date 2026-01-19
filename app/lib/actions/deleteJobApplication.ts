'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function deleteJobApplication(id: string) {
  try {
    await prisma.jobApplication.delete({
      where: { id }
    })

    revalidateTag('Job-Application', 'default')

    return {
      success: true,
      message: 'Job application deleted successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to delete job application',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          jobApplicationId: id
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete job application',
      message: 'Failed to delete job application'
    }
  }
}
