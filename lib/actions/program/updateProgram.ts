'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { PROGRAM_NULLABLE_FIELDS, programSchema } from '@/lib/validations/program.validation'
import { emptyToNull } from '@/lib/utils/emptyToNull'

export async function updateProgram(id: string, input: unknown) {
  if (!id) {
    return { success: false, error: 'Program ID is required.' }
  }

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
    const existingProgram = await prisma.program.findUnique({
      where: { id },
      select: { id: true }
    })

    if (!existingProgram) {
      return { success: false, error: 'Program not found', status: 404 }
    }

    const program = await prisma.program.update({
      where: { id },
      data: emptyToNull(data, PROGRAM_NULLABLE_FIELDS)
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Program updated successfully', {
      programId: program.id,
      programName: program.name
    })

    return { success: true, data: program }
  } catch (error) {
    await createLog('error', 'Failed to update program', {
      programId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update program. Please try again.'
    }
  }
}
