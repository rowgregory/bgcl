'use server'

import { ActionResult } from '@/types/common'
import { CITApplication } from '@prisma/client'
import { auth } from '../../auth'
import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

/**
 * Fetches a single CIT application by id.
 *
 * Admin-only — applications contain applicant PII (DOB, contacts, emails),
 * so this is guarded on session.
 */
export async function getCITApplicationById(id: string): Promise<ActionResult<CITApplication>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    if (!id?.trim()) {
      return { success: false, error: 'Missing application id' }
    }

    const application = await prisma.cITApplication.findUnique({
      where: { id }
    })

    if (!application) {
      return { success: false, error: 'Application not found' }
    }

    return { success: true, data: application }
  } catch (error) {
    await createLog('ERROR', 'Failed to fetch CIT application', {
      applicationId: id,
      error: error instanceof Error ? error.message : String(error)
    })
    return { success: false, error: 'Failed to load application.' }
  }
}
