import { resend } from '@/lib/resend/resend'
import volunteerFormNotification from '../email-templates/volunteer'
import contactFormNotification from '../email-templates/contact'
import jobApplicationNotification from '../email-templates/job'
import { ticketPurchaseAdminNotification } from '../email-templates/admin-ticket-purchase'
import { oneTimeDonationAdminNotification } from '../email-templates/admin-one-time-donation.template'
import { recurringDonationAdminNotification } from '../email-templates/admin-recurring-donation.template'
import citApplicationNotification from '../email-templates/cit-application-admin.template'

type NotificationType =
  | 'VOLUNTEER_FORM'
  | 'CONTACT_FORM'
  | 'JOB_APPLICATION'
  | 'TICKET_PURCHASE'
  | 'ONE_TIME_DONATION'
  | 'RECURRING_DONATION'
  | 'CIT_APPLICATION'

interface NotificationData {
  firstName?: string
  lastName?: string
  applicantName?: string
  email?: string
  customerName?: string
  customerEmail?: string
  eventTitle?: string
  tickets?: { name: string; quantity: number; price: number }[]
  totalAmount?: number
  orderId?: string
  recurringFrequency?: string

  // CIT application
  name?: string
  parentGuardianEmail?: string
  school?: string
  grade?: string
  weeksAvailable?: string[]
}

export default async function sendAdminNotification(notificationType: NotificationType, data: NotificationData) {
  try {
    let emailHtml: string
    let subject: string
    let recipientEmail: string

    const ericaEmail = 'esousa@bgcl.org'
    const infoEmail = 'info@bgcl.org'

    if (notificationType === 'VOLUNTEER_FORM') {
      emailHtml = volunteerFormNotification(data.firstName || '', data.lastName || '', data.email)
      subject = `New Volunteer Application from ${data.firstName} ${data.lastName}`
      recipientEmail = infoEmail
    } else if (notificationType === 'CONTACT_FORM') {
      emailHtml = contactFormNotification(data.firstName || '', data.lastName || '', data.email)
      subject = `New Contact Form Submission from ${data.firstName} ${data.lastName}`
      recipientEmail = infoEmail
    } else if (notificationType === 'TICKET_PURCHASE') {
      emailHtml = ticketPurchaseAdminNotification(
        data.customerName || '',
        data.customerEmail || '',
        data.eventTitle || '',
        data.totalAmount || 0,
        data.orderId || ''
      )
      subject = `New Ticket Purchase — ${data.customerName} · ${data.eventTitle}`
      recipientEmail = ericaEmail
    } else if (notificationType === 'ONE_TIME_DONATION') {
      emailHtml = oneTimeDonationAdminNotification(
        data.customerName || '',
        data.customerEmail || '',
        data.totalAmount || 0,
        data.orderId || ''
      )
      subject = `New Donation — ${data.customerName} · $${data.totalAmount}`
      recipientEmail = ericaEmail
    } else if (notificationType === 'RECURRING_DONATION') {
      emailHtml = recurringDonationAdminNotification(
        data.customerName || '',
        data.customerEmail || '',
        data.totalAmount || 0,
        data.orderId || '',
        data.recurringFrequency || 'Monthly'
      )
      subject = `New Recurring Donation — ${data.customerName} · $${data.totalAmount}/${data?.recurringFrequency === 'yearly' ? 'yr' : 'mo'}`
      recipientEmail = ericaEmail
    } else if (notificationType === 'CIT_APPLICATION') {
      emailHtml = citApplicationNotification({
        applicantName: data.name || '',
        parentGuardianEmail: data.parentGuardianEmail || '',
        school: data.school || '',
        grade: data.grade || '',
        weeksAvailable: data.weeksAvailable ?? []
      })
      subject = `New CIT Application from ${data.name}`
      recipientEmail = infoEmail
    } else {
      emailHtml = jobApplicationNotification(data.applicantName || `${data.firstName} ${data.lastName}`, data.email)
      subject = `New Job Application from ${data.applicantName || `${data.firstName} ${data.lastName}`}`
      recipientEmail = infoEmail
    }
    const replyToEmail = data.email || data.customerEmail || data.parentGuardianEmail

    await resend.emails.send({
      from: `Boys & Girls Club of Lynn <${process.env.RESEND_FROM_EMAIL}>`,
      to: recipientEmail,
      subject,
      html: emailHtml,
      ...(replyToEmail && { replyTo: replyToEmail })
    })
  } catch (emailError) {
    throw emailError
  }
}
