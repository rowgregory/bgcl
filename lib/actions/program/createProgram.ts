'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { programSchema, PROGRAM_NULLABLE_FIELDS } from '@/lib/validations/program.validation'
import { emptyToNull } from '@/lib/utils/emptyToNull'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function createProgram(input: unknown) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  const parsed = programSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid program data'
    }
  }

  const data = parsed.data

  try {
    const lastProgram = await prisma.program.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const program = await prisma.program.create({
      data: {
        ...emptyToNull(data, PROGRAM_NULLABLE_FIELDS),
        order: (lastProgram?.order ?? -1) + 1
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Program created successfully', {
      programId: program.id,
      name: program.name
    })

    return { success: true, data: program }
  } catch (error) {
    await createLog('error', 'Failed to create program', {
      name: data.name,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to create program. Please try again.'
    }
  }
}
