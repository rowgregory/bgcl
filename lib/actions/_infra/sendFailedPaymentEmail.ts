'use server'

import { failedPaymentTemplate } from '../../email-templates/failed-payment'
import { resend } from '../../resend/resend'
import { createLog } from '../log/createLog'

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
    await createLog('error', 'Failed to send failed payment email', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to send failed payment email. Please try again.' }
  }
}
