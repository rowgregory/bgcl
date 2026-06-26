import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export const getJobApplicationById = async (id: string) => {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        references: true
      }
    })

    if (!application) {
      await createLog('warn', 'Application not found', {
        jobApplicationId: id
      })
      return null
    }

    return application
  } catch (error) {
    await createLog('error', 'Failed to fetch job application by id', {
      error: error instanceof Error ? error.message : 'Unknown error',
      jobApplicationId: id
    })

    throw error
  }
}
