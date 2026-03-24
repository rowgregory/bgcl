import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getJobApplications = async () => {
  try {
    const jobApplications = await prisma.jobApplication.findMany({
      include: {
        references: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return jobApplications
  } catch (error) {
    await createLog('error', 'Failed to fetch job applications', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
