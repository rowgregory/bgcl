'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { CreateProgramInputs } from '@/types/entities/program'
import { revalidatePath } from 'next/cache'

export async function createProgram(data: CreateProgramInputs) {
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
    if (data.pdfLink) createData.pdfLink = data.pdfLink
    if (data.pdfDescription) createData.pdfDescription = data.pdfDescription

    const program = await prisma.program.create({
      data: createData
    })

    await createLog('info', 'Program created successfully', {
      programId: program.id,
      name: program.name
    })

    revalidatePath('/', 'layout')

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
