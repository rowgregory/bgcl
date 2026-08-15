import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export const getContactSubmissions = async () => {
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
