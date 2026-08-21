import prisma from '@/prisma/client'
import { createLog } from '@/lib/actions/log/createLog'

export async function getPartners() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { order: 'asc' }
    })
    return { success: true, data: partners, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch partners', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load partners' }
  }
}
