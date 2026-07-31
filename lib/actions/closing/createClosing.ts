'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { CreateClosingInput } from '@/types/entities/closing'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'
import { revalidatePath } from 'next/cache'

export async function createClosing(data: CreateClosingInput) {
  try {
    const closing = await prisma.closing.create({
      data: {
        title: data.title,
        date: data.date,
        order: data.order ?? 0
      }
    })

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = await buildLogMessage('created a closing', actor, context)

    await createLog('info', message, {
      closingId: closing.id,
      title: closing.title,
      date: closing.date,
      ...context
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create closing', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return {
      success: false,
      error: 'Failed to create closing. Please try again.'
    }
  }
}
