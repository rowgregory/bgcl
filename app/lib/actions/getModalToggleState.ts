'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getModalToggleState = unstable_cache(
  async (slug: string = 'home'): Promise<boolean> => {
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
      console.error('Error fetching modal toggle state:', error)
      return false
    }
  },
  ['getModalToggleState'],
  {
    tags: ['Page'],
    revalidate: 60 // Cache for 60 seconds
  }
)
