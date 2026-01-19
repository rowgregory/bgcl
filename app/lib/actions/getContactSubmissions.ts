import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getContactSubmissions = unstable_cache(
  async (): Promise<IContactSubmission[]> => {
    try {
      const contactSubmissions = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' }
      })

      return contactSubmissions
    } catch (error) {
      prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch contact submissions',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return []
    }
  },
  ['getContactSubmissions'],
  { tags: ['Contact-Submission'] }
)
