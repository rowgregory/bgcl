import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getNewsletters = async (): Promise<
  Array<{
    id: string
    order: number
    month: string
    year: number
    pdfUrl: string
    createdAt: Date
    updatedAt: Date
  }>
> => {
  try {
    const newsletters = await prisma.newsletter.findMany({
      orderBy: { order: 'desc' }
    })

    return newsletters
  } catch (error) {
    await createLog('error', 'Failed to fetch newsletters', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
