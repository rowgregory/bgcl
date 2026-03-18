'use server'

import prisma from '@/prisma/client'

import { createLog } from './createLog'
import { CreateClubResourceInput } from '@/types/entities/club-resource'

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
