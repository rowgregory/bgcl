'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'
import { revalidatePath } from 'next/cache'
import { resourceSchema } from '@/lib/validations/resource.validation'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function createResource(input: unknown) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  const parsed = resourceSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid resource data'
    }
  }

  const data = parsed.data

  try {
    // Place new resources at the end of the list
    const lastResource = await prisma.resource.findFirst({ orderBy: { order: 'desc' } })

    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        url: data.url,
        order: (lastResource?.order ?? -1) + 1
      }
    })

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = await buildLogMessage('created a resource', actor, context)

    await createLog('info', message, {
      resourceId: resource.id,
      title: resource.title,
      ...context
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create resource', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return {
      success: false,
      error: 'Failed to create resource. Please try again.'
    }
  }
}
