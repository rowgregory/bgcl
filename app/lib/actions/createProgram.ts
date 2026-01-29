'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'
import { ICreateProgram } from '@/types/entities/program'

export async function createProgram(data: ICreateProgram) {
  try {
    const createData: any = {
      name: data.name,
      frequency: 'Daily'
    }

    // Add optional descriptions if they exist
    if (data.ageGroup) createData.ageGroup = data.ageGroup
    if (data.location) createData.location = data.location
    if (data.dropOffEnd) createData.dropOffEnd = data.dropOffEnd
    if (data.pickUpStart) createData.pickUpStart = data.pickUpStart
    if (data.pickUpEnd) createData.pickUpEnd = data.pickUpEnd
    if (data.datesAvailable) createData.datesAvailable = data.datesAvailable
    if (data.license) createData.license = data.license
    if (data.dropOffStart) createData.dropOffStart = data.dropOffStart
    if (data.image) createData.image = data.image
    if (data.imageTwo) createData.imageTwo = data.imageTwo
    if (data.showAgeGroup) createData.showAgeGroup = data.showAgeGroup
    if (data.additionalDetails) createData.additionalDetails = data.additionalDetails
    if (data.showThemes) createData.showThemes = data.showThemes
    if (data.themes) createData.themes = data.themes
    if (data.descriptions) createData.descriptions = data.descriptions
    if (data.externalLink) createData.externalLink = data.externalLink
    if (data.isListed) createData.isListed = data.isListed

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
    await createLog('error', 'Failed to create program', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name: data.name
    })

    return {
      success: false,
      error: 'Failed to create program. Please try again.'
    }
  }
}
