'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'
import { revalidatePath } from 'next/cache'
import { closingSchema } from '@/lib/validations/closing.validation'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function createClosing(input: unknown) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  const parsed = closingSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid closing data'
    }
  }

  const data = parsed.data

  try {
    // Place new closings at the end of the list
    const lastClosing = await prisma.closing.findFirst({ orderBy: { order: 'desc' } })

    const closing = await prisma.closing.create({
      data: {
        title: data.title,
        date: data.date,
        order: (lastClosing?.order ?? -1) + 1
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
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return {
        success: false,
        error: 'A closing with this title already exists.'
      }
    }

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
