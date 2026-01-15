'use server'

import { unstable_cache } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getJobApplicationById = unstable_cache(
  async (id: string) => {
    try {
      // Mock data for demo ID
      if (id === '123') {
        return {
          id: '123',
          applicantName: 'John Doe',
          email: 'john.doe@example.com',
          positionAppliedFor: 'Program Director',
          employmentType: 'FULL_TIME',
          hoursAvailable: 'Monday-Friday 9am-5pm',
          languages: ['English', 'Spanish'],
          resumeFileName: 'John_Doe_Resume.pdf',
          resumeUrl: 'https://example.com/resume.pdf',
          status: 'PENDING' as const,
          submissionStatus: 'SUBMITTED' as const,
          submittedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      }

      const application = await prisma.jobApplication.findUnique({
        where: { id },
        select: {
          id: true,
          applicantName: true,
          email: true,
          positionAppliedFor: true,
          employmentType: true,
          hoursAvailable: true,
          languages: true,
          resumeFileName: true,
          resumeUrl: true,
          status: true,
          submissionStatus: true,
          submittedAt: true,
          createdAt: true
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
