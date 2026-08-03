'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { closingSchema } from '@/lib/validations/closing.validation'

export async function updateClosing(id: string, input: unknown) {
  if (!id) {
    return { success: false, error: 'Closing ID is required.' }
  }

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
    await prisma.closing.update({
      where: { id },
      data: {
        title: data.title,
        date: data.date
      }
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

    await createLog('error', 'Failed to update closing', {
      closingId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update closing. Please try again.'
    }
  }
}
