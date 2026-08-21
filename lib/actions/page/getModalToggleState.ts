import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export const getModalToggleState = async (slug: string = 'home') => {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const page = await prisma.page.findUnique({
      where: { slug },
      select: { content: true }
    })

    if (!page?.content) return { success: false, data: null, error: 'Could not find page content' }

    const content = page.content as Array<{ id: string; value: any }>
    const modalToggle = content.find((obj) => obj.id === 'modal_toggleModal')

    return { success: true, data: modalToggle?.value === 'true' || modalToggle?.value === true, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch modal toggle state', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    })
    return { success: false, data: null, error: 'Could not load modal toggle state' }
  }
}
