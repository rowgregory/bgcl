'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

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
    await prisma.resource.create({
      data: {
        title: data.title,
        url: data.url || null,
        order: data.order ?? 0
      }
    })

    revalidateTag('Club-Resource', 'default')

    return {
      success: true,
      message: 'Club resource created successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to create club resource',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          input: data
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create club resource',
      message: 'Failed to create club resource'
    }
  }
}
