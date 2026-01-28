'use server'

import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'
import prisma from '@/prisma/client'

export async function setToggleModal(slug: string) {
  try {
    // Get the current page
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

    console.log('!currentContent?.toggleModal : ', currentContent)

    // Toggle the modal value
    const updatedContent = {
      ...currentContent,
      modal: { ...currentContent.modal, toggleModal: !currentContent?.modal.toggleModal }
    }

    // Update the page
    await prisma.page.update({
      where: { slug },
      data: { content: updatedContent }
    })

    await createLog('info', 'Modal visibility toggled', {
      slug,
      pageId: page.id,
      modalEnabled: updatedContent.toggleModal
    })

    revalidateTag('Page', 'default')

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
      error: error instanceof Error ? error.message : 'Failed to toggle modal',
      status: 500
    }
  }
}
