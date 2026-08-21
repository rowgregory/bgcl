'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

/**
 * Fetches all CIT applications for the admin review surface, newest first.
 *
 * Admin-only — applications contain applicant PII, so this is guarded on
 * session. Intended to be called from the server component Page and passed
 * down to the client table.
 */
export async function getCITApplications() {
  const auth = await requireAdmin({ allowProgram: true })
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const applications = await prisma.cITApplication.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: applications, error: null }
  } catch (error) {
    await createLog('ERROR', 'Failed to fetch CIT applications', {
      error: error instanceof Error ? error.message : String(error)
    })
    return { success: false, data: null, error: 'Failed to load applications.' }
  }
}
