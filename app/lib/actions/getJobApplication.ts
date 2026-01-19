'use server'

import { unstable_cache } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getJobApplicationById = unstable_cache(
  async (id: string) => {
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
      await createLog('error', 'Failed to fetch application', {
        error: error instanceof Error ? error.message : 'Unknown error',
        jobApplicationId: id
      })
      return null
    }
  },
  ['getJobApplicationById'],
  { tags: ['Job-Application'] }
)
