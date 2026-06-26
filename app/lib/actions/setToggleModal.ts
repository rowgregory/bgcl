'use server'

import { revalidatePath } from 'next/cache'
import { createLog } from './log/createLog'
import prisma from '@/prisma/client'

export async function setToggleModal(slug: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { slug }
    })

    if (!page) {
      return {
        success: false,
        error: 'Page not found',
        status: 404
      }
    }

    const currentContent = page.content as any

    const updatedContent = {
      ...currentContent,
      modal: { ...currentContent.modal, toggleModal: !currentContent?.modal.toggleModal }
    }

    await prisma.page.update({
      where: { slug },
      data: { content: updatedContent }
    })

    await createLog('info', 'Modal visibility toggled', {
      slug,
      pageId: page.id,
      modalEnabled: updatedContent.toggleModal
    })

    revalidatePath('/', 'layout')

    return {
      success: true,
      isToggledOn: !currentContent?.modal.toggleModal
    }
  } catch (error) {
    await createLog('error', 'Failed to toggle modal', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    })

    return {
      success: false,
      error: 'Failed to toggle modal. Please try again.'
    }
  }
}
