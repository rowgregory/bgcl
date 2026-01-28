'use server'

import { failedPaymentTemplate } from '../email-templates/failed-payment'
import { resend } from '../resend'

export async function sendFailedPaymentEmail(customerName: string, customerEmail: string, amount: number) {
  try {
    const retryUrl = `${process.env.NEXTAUTH_URL}/donate`

    await resend.emails.send({
      from: `Boys & Girls Club <${process.env.RESEND_FROM_EMAIL}>`,
      to: customerEmail,
      subject: 'Action Needed: Complete Your Donation',
      html: failedPaymentTemplate(customerName, amount, retryUrl)
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending failed payment email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' }
  }
}
