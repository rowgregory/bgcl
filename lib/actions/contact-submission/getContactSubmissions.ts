import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export const getContactSubmissions = async () => {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const contactSubmissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: contactSubmissions, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch contact submissions', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, edata: null, error: 'Could not load contact submissions' }
  }
}
