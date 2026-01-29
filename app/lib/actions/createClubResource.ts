'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export interface CreateClubResourceInput {
  title: string
  url?: string
  order?: number
}

export interface UpdateClubResourceInput extends CreateClubResourceInput {
  id: string
}

export async function createClubResource(data: CreateClubResourceInput) {
  try {
    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        url: data.url || null,
        order: data.order ?? 0
      }
    })

    await createLog('info', 'Club resource created', {
      resourceId: resource.id,
      title: resource.title
    })

    revalidateTag('Club-Resource', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create club resource', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return {
      success: false,
      error: 'Failed to create club resource. Please try again.'
    }
  }
}
