import { resend } from '@/app/lib/resend'
import volunteerFormNotification from '../email-templates/volunteer'
import contactFormNotification from '../email-templates/contact'
import jobApplicationNotification from '../email-templates/job'

type NotificationType = 'VOLUNTEER_FORM' | 'CONTACT_FORM' | 'JOB_APPLICATION'

interface NotificationData {
  firstName?: string
  lastName?: string
  applicantName?: string
  email: string
}

// Helper function for sending admin notification emails
export default async function sendAdminNotification(notificationType: NotificationType, data: NotificationData) {
  try {
    let emailHtml: string
    let subject: string

    const recipientEmail = 'info@bgcl.org'

    if (notificationType === 'VOLUNTEER_FORM') {
      emailHtml = volunteerFormNotification(data.firstName || '', data.lastName || '', data.email)
      subject = `New Volunteer Application from ${data.firstName} ${data.lastName}`
    } else if (notificationType === 'CONTACT_FORM') {
      emailHtml = contactFormNotification(data.firstName || '', data.lastName || '', data.email)
      subject = `New Contact Form Submission from ${data.firstName} ${data.lastName}`
    } else {
      emailHtml = jobApplicationNotification(data.applicantName || `${data.firstName} ${data.lastName}`, data.email)
      subject = `New Job Application from ${data.applicantName || `${data.firstName} ${data.lastName}`}`
    }

    await resend.emails.send({
      from: `Boys & Girls Club of Lynn <${process.env.RESEND_FROM_EMAIL}>`,
      to: recipientEmail,
      subject,
      html: emailHtml,
      replyTo: data.email // Allow quick reply to the submitter
    })
  } catch (emailError) {
    console.error('Error sending admin notification email:', emailError)
    throw emailError // Re-throw so calling code can handle
  }
}
