'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deletePartner(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const partner = await prisma.partner.findUnique({
      where: { id },
      select: { id: true, name: true }
    })

    if (!partner) {
      return {
        success: false,
        data: null,
        error: 'Partner not found'
      }
    }

    await prisma.partner.delete({
      where: { id }
    })

    await createLog('info', 'Partner deleted', {
      partnerId: id,
      partnerTitle: partner.name
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete partner', {
      error: error instanceof Error ? error.message : 'Unknown error',
      partnerId: id
    })

    return {
      success: false,
      data: null,
      error: 'Failed to delete partner. Please try again.'
    }
  }
}
