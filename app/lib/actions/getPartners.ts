import prisma from '@/prisma/client'
import { IPartner } from '@/types/entities/partner'

export const getPartners = async (): Promise<IPartner[]> => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { order: 'asc' }
    })

    return partners
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to fetch partners',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    })

    return []
  }
}
