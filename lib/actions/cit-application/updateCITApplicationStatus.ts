'use server'

import { ActionResult } from '@/types/common.types'
import { UpdateCITApplicationStatusInput } from '@/types/entities/cit-application.types'
import { CITApplication } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { auth } from '../../auth/auth'
import { CIT_ADMIN_PATH, CIT_APPLICATION_STATUSES } from '../../constants/cit-application.constants'
import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export async function updateCITApplicationStatus(
  input: UpdateCITApplicationStatusInput
): Promise<ActionResult<CITApplication>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    if (!input.id?.trim()) {
      return { success: false, error: 'Missing application id' }
    }

    if (!CIT_APPLICATION_STATUSES.includes(input.status)) {
      return { success: false, error: 'Invalid status' }
    }

    const application = await prisma.cITApplication.update({
      where: { id: input.id },
      data: { status: input.status }
    })

    await createLog('INFO', `CIT application status updated: ${application.id} → ${application.status}`, {
      applicationId: application.id,
      status: application.status,
      updatedBy: session.user.email ?? session.user.id
    })

    revalidatePath(CIT_ADMIN_PATH)

    return { success: true, data: application }
  } catch (error) {
    await createLog('ERROR', 'Failed to update CIT application status', {
      applicationId: input.id,
      error: error instanceof Error ? error.message : String(error)
    })
    return { success: false, error: 'Failed to update status. Please try again.' }
  }
}
