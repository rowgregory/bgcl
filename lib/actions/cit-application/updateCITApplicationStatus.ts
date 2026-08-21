'use server'

import { UpdateCITApplicationStatusInput } from '@/types/entities/cit-application.types'
import { revalidatePath } from 'next/cache'
import { CIT_ADMIN_PATH, CIT_APPLICATION_STATUSES } from '../../constants/cit-application.constants'
import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function updateCITApplicationStatus(input: UpdateCITApplicationStatusInput) {
  const auth = await requireAdmin({ allowProgram: true })
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    if (!input.id?.trim()) {
      return { success: false, data: null, error: 'Missing application id' }
    }

    if (!CIT_APPLICATION_STATUSES.includes(input.status)) {
      return { success: false, data: null, error: 'Invalid status' }
    }

    const application = await prisma.cITApplication.update({
      where: { id: input.id },
      data: { status: input.status }
    })

    await createLog('INFO', `CIT application status updated: ${application.id} → ${application.status}`, {
      applicationId: application.id,
      status: application.status,
      updatedBy: auth.user.email ?? auth.user.id
    })

    revalidatePath(CIT_ADMIN_PATH)

    return { success: true, data: application, error: null }
  } catch (error) {
    await createLog('ERROR', 'Failed to update CIT application status', {
      applicationId: input.id,
      error: error instanceof Error ? error.message : String(error)
    })
    return { success: false, data: null, error: 'Failed to update status. Please try again.' }
  }
}
