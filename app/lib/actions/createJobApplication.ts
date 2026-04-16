'use server'

import prisma from '@/prisma/client'
import sendAdminNotification from '../utils/sendAdminNotification'
import { createLog } from './createLog'
import { CreateJobApplicationInput } from '@/types/entities/job-application'

export const createJobApplication = async (data: CreateJobApplicationInput) => {
  try {
    const { references, ...applicationData } = data

    const jobApplication = await prisma.jobApplication.create({
      data: {
        ...applicationData,
        submissionStatus: 'COMPLETE',
        references: {
          create: references
        }
      },
      include: {
        references: true
      }
    })

    // Send admin notification email for job application
    try {
      await sendAdminNotification('JOB_APPLICATION', {
        applicantName: data.applicantName.trim(),
        email: data.email.trim()
      })
    } catch (emailError) {
      await createLog('error', 'Failed to send admin notification', {
        type: 'JOB_APPLICATION',
        email: data.email,
        error: emailError instanceof Error ? emailError.message : 'Unknown error'
      })
    }

    return {
      success: true,
      jobApplicationId: jobApplication.id
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return {
        success: false,
        error: 'An application with this email address has already been submitted.'
      }
    }

    await createLog('error', 'Failed to create job application', {
      error: error instanceof Error ? error.message : 'Unknown error',
      applicantName: data.applicantName,
      email: data.email
    })

    return {
      success: false,
      error: 'Failed to create job application. Please try again.'
    }
  }
}
