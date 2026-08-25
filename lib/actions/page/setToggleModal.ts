'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

const MODAL_FIELD_ID = 'modal_toggleModal'

type PageField = { id: string; type: string; label: string; value: string; section: string }

export async function setToggleModal(slug: string) {
  const auth = await requireAdmin()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    const page = await prisma.page.findUnique({ where: { slug } })

    if (!page) return { success: false, data: null, error: 'Page not found' }

    const currentContent = page.content as PageField[]
    const field = currentContent.find((c) => c.id === MODAL_FIELD_ID)

    if (!field) return { success: false, data: null, error: 'Modal setting not found on this page' }

    // Values in the content array are stored as strings, including booleans
    const next = field.value !== 'true'

    const updatedContent = currentContent.map((c) => (c.id === MODAL_FIELD_ID ? { ...c, value: String(next) } : c))

    await prisma.page.update({ where: { slug }, data: { content: updatedContent } })

    await createLog('info', 'Modal visibility toggled', { slug, pageId: page.id, modalEnabled: next })

    revalidatePath('/', 'layout')

    return { success: true, data: { isToggledOn: next }, error: null }
  } catch (error) {
    await createLog('error', 'Failed to toggle modal', {
      slug,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Failed to toggle modal. Please try again.' }
  }
}
