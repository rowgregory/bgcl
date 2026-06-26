'use server'

import prisma from '@/prisma/client'
import { isValidEmail } from '../../utils/regex'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'
import { createLog } from '../log/createLog'
import sendAdminNotification from '../../utils/sendAdminNotification'

export const createContactSubmission = async (data: Omit<IContactSubmission, 'id' | 'createdAt'>) => {
  try {
    if (!data.firstName?.trim() || !data.lastName?.trim() || !data.email?.trim() || !data.phone?.trim()) {
      return { success: false, error: 'Missing required fields', data: null }
    }

    if (!isValidEmail(data.email)) {
      return { success: false, error: 'Invalid email format', data: null }
    }

    const submissionData: any = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      type: data.type
    }

    if (data.subject?.trim()) submissionData.subject = data.subject.trim()
    if (data.message?.trim()) submissionData.message = data.message.trim()
    if (data.availabilityDays) submissionData.availabilityDays = data.availabilityDays
    if (data.availabilityHours) submissionData.availabilityHours = data.availabilityHours
    if (data.programInterests) submissionData.programInterests = data.programInterests
    if (data.yearsExperience != null) submissionData.yearsExperience = data.yearsExperience
    if (data.backgroundCheckAck != null) submissionData.backgroundCheckAck = data.backgroundCheckAck
    if (data.additionalInfo?.trim()) submissionData.additionalInfo = data.additionalInfo.trim()

    await prisma.contactSubmission.create({ data: submissionData })

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = await buildLogMessage('submitted a contact form', actor, context)

    await createLog('info', message, {
      type: data.type,
      email: data.email.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      ...context
    })

    try {
      const notificationType = data.type === 'VOLUNTEER' ? 'VOLUNTEER_FORM' : 'CONTACT_FORM'
      await sendAdminNotification(notificationType, {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim()
      })
    } catch (emailError) {
      await createLog('error', 'Failed to send admin notification', {
        type: data.type,
        email: data.email,
        error: emailError instanceof Error ? emailError.message : 'Unknown error'
      })
    }

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create contact submission', {
      error: error instanceof Error ? error.message : 'Unknown error',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    })

    return { success: false, error: 'Failed to create contact submission. Please try again.' }
  }
}
