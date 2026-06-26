'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { UpdateProgramInputs } from '@/types/entities/program'
import { revalidatePath } from 'next/cache'

export async function updateProgram(data: UpdateProgramInputs) {
  try {
    const existingProgram = await prisma.program.findUnique({
      where: { id: data?.id }
    })

    if (!existingProgram) {
      return { success: false, error: 'Program not found', status: 404 }
    }

    const { isUpdating, createdAt, updatedAt, id, ...rest } = data

    // Filter out null/undefined values
    const cleanData = Object.entries(rest).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as any)

    const program = await prisma.program.update({
      where: { id: data?.id },
      data: cleanData
    })

    await createLog('info', 'Program updated successfully', {
      programId: program.id,
      programName: program.name,
      updatedFields: Object.keys(data)
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update program', {
      error: error instanceof Error ? error.message : 'Unknown error',
      programId: data?.id
    })

    return {
      success: false,
      error: 'Failed to update program. Please try again.'
    }
  }
}
