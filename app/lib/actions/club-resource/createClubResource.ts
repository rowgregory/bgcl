'use server'

import prisma from '@/prisma/client'

import { createLog } from '../createLog'
import { CreateClubResourceInput } from '@/types/entities/club-resource'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'

export async function createClubResource(data: CreateClubResourceInput) {
  try {
    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        url: data.url || null,
        order: data.order ?? 0
      }
    })

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = await buildLogMessage('created a closing', actor, context)

    await createLog('info', message, {
      resourceId: resource.id,
      title: resource.title,
      ...context
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
