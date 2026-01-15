'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'
import { ICreateProgram } from '@/types/entities/program'

export async function createProgram(data: ICreateProgram) {
  try {
    const createData: any = {
      name: data.name,
      description1: data.description1,
      ageGroup: data.ageGroup,
      location: data.location,
      frequency: data.frequency,
      dropOffStart: data.dropOffStart,
      dropOffEnd: data.dropOffEnd,
      pickUpStart: data.pickUpStart,
      pickUpEnd: data.pickUpEnd,
      datesAvailable: data.datesAvailable,
      license: data.license
    }

    // Add optional descriptions if they exist
    if (data.description2) createData.description2 = data.description2
    if (data.description3) createData.description3 = data.description3
    if (data.description4) createData.description4 = data.description4
    if (data.description5) createData.description5 = data.description5
    if (data.image) createData.image = data.image

    const program = await prisma.program.create({
      data: createData
    })

    await createLog('info', 'Program created successfully', {
      programId: program.id,
      name: program.name
    })

    revalidateTag('Program', 'default')

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create program'

    await createLog('error', 'Failed to create program', {
      error: errorMessage,
      inputData: {
        name: data.name
      }
    })

    throw new Error(errorMessage)
  }
}
