'use server'

import { ActionResult } from '@/types/common'
import { CITApplication } from '@prisma/client'
import { auth } from '../../auth'
import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

/**
 * Fetches all CIT applications for the admin review surface, newest first.
 *
 * Admin-only — applications contain applicant PII, so this is guarded on
 * session. Intended to be called from the server component Page and passed
 * down to the client table.
 */
export async function getCITApplications(): Promise<ActionResult<CITApplication[]>> {
  // ── Auth guard ──────────────────────────────────────────────────────────────
  const session = await auth()
  if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'PROGRAM' && session?.user?.role !== 'SUPERUSER') {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const applications = await prisma.cITApplication.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: applications }
  } catch (error) {
    await createLog('ERROR', 'Failed to fetch CIT applications', {
      error: error instanceof Error ? error.message : String(error)
    })
    return { success: false, error: 'Failed to load applications.' }
  }
}
