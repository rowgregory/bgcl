import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getContactSubmissions = async (): Promise<IContactSubmission[]> => {
  try {
    const contactSubmissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return contactSubmissions
  } catch (error) {
    await createLog('error', 'Failed to fetch contact submissions', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
