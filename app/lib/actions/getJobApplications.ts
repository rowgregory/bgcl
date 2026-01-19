'use server'

import { unstable_cache } from 'next/cache'
import prisma from '@/prisma/client'

export const getJobApplications = unstable_cache(
  async () => {
    try {
      const jobApplications = await prisma.jobApplication.findMany({
        include: {
          references: true
        }
      })

      return jobApplications
    } catch (error) {
      await prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch job applications',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return null
    }
  },
  ['getJobApplications'],
  { tags: ['Job-Application'] }
)
