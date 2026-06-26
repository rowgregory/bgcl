'use server'

import prisma from '@/prisma/client'
import { CreateJobApplicationInput } from '@/types/entities/job-application'
import { createLog } from '../log/createLog'
import sendAdminNotification from '../../utils/sendAdminNotification'
import { resend } from '../../resend'
import { jobApplicationConfirmationEmail } from '../../email-templates/job-applicant.template'

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

    await createLog('info', 'Job application created', {
      jobApplicationId: jobApplication.id,
      applicantName: data.applicantName.trim(),
      email: data.email.trim(),
      positionTypes: data.positionTypes,
      employmentType: data.employmentType
    })

    try {
      await sendAdminNotification('JOB_APPLICATION', {
        applicantName: data.applicantName.trim(),
        email: data.email.trim()
      })

      await resend.emails.send({
        from: `Boys & Girls Club of Lynn <${process.env.RESEND_FROM_EMAIL}>`,
        to: jobApplication.email,
        subject: 'Thank You for Applying — Boys & Girls Club of Lynn',
        html: jobApplicationConfirmationEmail()
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
      prismaCode: error?.code,
      prismaMeta: error?.meta,
      applicantName: data.applicantName,
      email: data.email,
      fieldLengths: {
        applicantName: data.applicantName?.length,
        email: data.email?.length,
        hoursAvailable: data.hoursAvailable?.length,
        languages: data.languages?.length,
        licenseNumber: data.licenseNumber?.length,
        signature: data.signature?.length,
        resumeUrl: data.resumeUrl?.length,
        resumeFileName: data.resumeFileName?.length,
        youthOrgEmployment: data.youthOrgEmployment?.length,
        education: data.education?.length,
        extracurricularsSkills: data.extracurricularsSkills?.length
      }
    })

    return {
      success: false,
      error: 'Failed to create job application. Please try again.'
    }
  }
}
