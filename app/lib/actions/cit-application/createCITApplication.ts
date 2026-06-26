'use server'

import { ActionResult } from '@/types/common'
import { CreateCITApplicationInput } from '@/types/entities/cit-application.types'
import { CITApplication } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { isValidEmail } from '../../utils/regex'
import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { CIT_ADMIN_PATH, CIT_APPLICATION_PATH } from '../../constants/cit-application.constants'
import sendAdminNotification from '../../utils/sendAdminNotification'
import { resend } from '../../resend'
import { citApplicationConfirmationEmail } from '../../email-templates/cit-application-confirmation.template'

/**
 * Creates a new CIT application.
 *
 * Public action — applicants are unauthenticated, so this validates input
 * rather than guarding on a session. `status` defaults to PENDING at the
 * schema level.
 */
export async function createCITApplication(input: CreateCITApplicationInput): Promise<ActionResult<CITApplication>> {
  try {
    // ── Validation ────────────────────────────────────────────────────────────
    const requiredStrings: [keyof CreateCITApplicationInput, string][] = [
      ['name', input.name],
      ['city', input.city],
      ['school', input.school],
      ['grade', input.grade],
      ['cellPhone', input.cellPhone],
      ['parentGuardianEmail', input.parentGuardianEmail],
      ['emergencyContact1', input.emergencyContact1],
      ['emergencyContact2', input.emergencyContact2],
      ['strengths', input.strengths],
      ['hopesToLearn', input.hopesToLearn],
      ['hobbiesExtracurriculars', input.hobbiesExtracurriculars]
    ]

    for (const [field, value] of requiredStrings) {
      if (!value || !value.trim()) {
        return { success: false, error: `Missing required field: ${field}` }
      }
    }

    if (!isValidEmail(input.parentGuardianEmail)) {
      return { success: false, error: 'Invalid parent/guardian email' }
    }

    if (input.personalEmail && !isValidEmail(input.personalEmail)) {
      return { success: false, error: 'Invalid personal email' }
    }

    if (Number.isNaN(input.age) || input.age <= 0) {
      return { success: false, error: 'Invalid age' }
    }

    if (!(input.dateOfBirth instanceof Date) || Number.isNaN(input.dateOfBirth.getTime())) {
      return { success: false, error: 'Invalid date of birth' }
    }

    if (!Array.isArray(input.weeksAvailable) || input.weeksAvailable.length === 0) {
      return { success: false, error: 'Select at least one week of availability' }
    }

    // ── Create ────────────────────────────────────────────────────────────────
    const application = await prisma.cITApplication.create({
      data: {
        name: input.name.trim(),
        dateOfBirth: input.dateOfBirth,
        age: input.age,
        city: input.city.trim(),
        school: input.school.trim(),
        grade: input.grade.trim(),
        cellPhone: input.cellPhone.trim(),
        personalEmail: input.personalEmail?.trim() || null,
        parentGuardianEmail: input.parentGuardianEmail.trim(),
        emergencyContact1: input.emergencyContact1.trim(),
        emergencyContact2: input.emergencyContact2.trim(),
        weeksAvailable: input.weeksAvailable,
        strengths: input.strengths.trim(),
        hopesToLearn: input.hopesToLearn.trim(),
        hobbiesExtracurriculars: input.hobbiesExtracurriculars.trim()
      }
    })

    try {
      await sendAdminNotification('CIT_APPLICATION', {
        name: input.name.trim(),
        parentGuardianEmail: input.parentGuardianEmail.trim(),
        school: input.school.trim(),
        grade: input.grade.trim(),
        weeksAvailable: input.weeksAvailable
      })

      await resend.emails.send({
        from: `Boys & Girls Club of Lynn <${process.env.RESEND_FROM_EMAIL}>`,
        to: input.parentGuardianEmail.trim(),
        subject: 'Thank You for Applying — Boys & Girls Club of Lynn',
        html: citApplicationConfirmationEmail()
      })
    } catch (emailError) {
      await createLog('error', 'Failed to send CIT application notification', {
        type: 'CIT_APPLICATION',
        email: input.parentGuardianEmail,
        error: emailError instanceof Error ? emailError.message : 'Unknown error'
      })
    }

    await createLog('INFO', `CIT application created: ${application.id}`, {
      applicationId: application.id,
      name: application.name
    })

    revalidatePath(CIT_APPLICATION_PATH)
    revalidatePath(CIT_ADMIN_PATH)

    return { success: true, data: application }
  } catch (error) {
    await createLog('ERROR', 'Failed to create CIT application', {
      error: error instanceof Error ? error.message : String(error)
    })
    return { success: false, error: 'Failed to submit application. Please try again.' }
  }
}
