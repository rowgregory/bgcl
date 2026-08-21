import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function getJobApplications() {
  const auth = await requireAdmin({ allowProgram: true })
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const jobApplications = await prisma.jobApplication.findMany({
      include: {
        references: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: jobApplications, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch job applications', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load job applications' }
  }
}
