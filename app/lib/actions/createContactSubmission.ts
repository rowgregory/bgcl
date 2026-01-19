'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'

export const createContactSubmission = async (data: Omit<IContactSubmission, 'id' | 'createdAt'>) => {
  try {
    // Validate required fields
    if (!data.firstName?.trim() || !data.lastName?.trim() || !data.email?.trim() || !data.phone?.trim()) {
      return {
        success: false,
        error: 'Missing required fields',
        data: null
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Invalid email format',
        data: null
      }
    }

    // Build submission object - only include attributes if they exist
    const submissionData: any = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      type: data.type
    }

    // Add optional fields only if they exist and aren't empty
    if (data.subject?.trim()) {
      submissionData.subject = data.subject.trim()
    }

    if (data.message?.trim()) {
      submissionData.message = data.message.trim()
    }

    if (data.availabilityDays) {
      submissionData.availabilityDays = data.availabilityDays
    }

    if (data.availabilityHours) {
      submissionData.availabilityHours = data.availabilityHours
    }

    if (data.programInterests) {
      submissionData.programInterests = data.programInterests
    }

    if (data.yearsExperience !== null && data.yearsExperience !== undefined) {
      submissionData.yearsExperience = data.yearsExperience
    }

    if (data.backgroundCheckAck !== null && data.backgroundCheckAck !== undefined) {
      submissionData.backgroundCheckAck = data.backgroundCheckAck
    }

    if (data.additionalInfo?.trim()) {
      submissionData.additionalInfo = data.additionalInfo.trim()
    }

    await prisma.contactSubmission.create({
      data: submissionData
    })

    // Revalidate cache
    revalidatePath('Contact-Submission')

    return {
      success: true
    }
  } catch (error) {
    console.error('Error creating contact submission:', error)
    return {
      success: false,
      error: 'Failed to submit form. Please try again.',
      data: null
    }
  }
}
