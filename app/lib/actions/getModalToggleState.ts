import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getModalToggleState = async (slug: string = 'home'): Promise<boolean> => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
      select: { content: true }
    })

    if (!page) {
      return false
    }

    const content = page.content as any
    return content?.modal?.toggleModal === true
  } catch (error) {
    await createLog('error', 'Failed to fetch modal toggle state', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
