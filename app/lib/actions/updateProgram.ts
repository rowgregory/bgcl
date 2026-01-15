'use server'

import prisma from '@/prisma/client'
import { IUpdateProgram } from '@/types/entities/program'
import { createLog } from './createLog'
import { revalidateTag } from 'next/cache'

export async function updateProgram(programId: string, body: IUpdateProgram) {
  try {
    const existingProgram = await prisma.program.findUnique({
      where: { id: programId }
    })

    if (!existingProgram) {
      await createLog('warn', 'Program not found for update', {
        programId
      })
      return { success: false, error: 'Program not found', status: 404 }
    }

    const { isUpdating, createdAt, updatedAt, id, ...rest } = body

    // Filter out null/undefined values
    const cleanData = Object.entries(rest).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as any)

    const program = await prisma.program.update({
      where: { id: programId },
      data: cleanData
    })

    await createLog('info', 'Program updated successfully', {
      programId: program.id,
      programName: program.name,
      updatedFields: Object.keys(body)
    })

    revalidateTag('Program', 'default')

    return { success: true, program }
  } catch (error) {
    await createLog('error', 'Failed to update program', {
      error: error instanceof Error ? error.message : 'Unknown error',
      programId
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update program',
      status: 500
    }
  }
}
