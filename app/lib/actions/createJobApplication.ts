'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export interface CreateJobApplicationInput {
  applicantName: string
  email: string
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'SEASONAL'
  hoursAvailable: string
  languages: string
  hasValidDriverLicense: boolean
  licenseNumber?: string
  licenseExpiration?: Date
  noLicenseReason?: string
  licenseSuspended?: boolean
  suspensionExplanation?: string
  trafficViolations?: string
  resumeUrl?: string
  resumeFileName?: string
  resumeFileSize?: number
  resumeUploadedAt?: Date
  agreeToTerms: boolean
  certifyInformation: boolean
  authorizeBackground: boolean
  understandActiveStatus: boolean
  signature?: string
  references: {
    name: string
    positionAndCompany: string
    workRelationship: string
    phone: string
    email: string
  }[]
}

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

    revalidateTag('Job-Application', 'default')

    return {
      success: true,
      jobApplicationId: jobApplication.id
    }
  } catch (error) {
    console.error('Error creating job application:', error)
    return {
      success: false,
      error: 'Failed to create job application'
    }
  }
}
