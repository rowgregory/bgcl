'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { createLog } from '../log/createLog'

export async function deletePartner(id: string) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { id },
      select: { id: true, name: true }
    })

    if (!partner) {
      return {
        success: false,
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
      error: 'Failed to delete partner. Please try again.'
    }
  }
}
