'use server'

import Stripe from 'stripe'
import prisma from '@/prisma/client'
import { stripe } from '../../stripe/stripeClient'
import { requireUser } from '@/lib/utils/requireAdmin'
import { createLog } from '../log/createLog'

export async function getMyDonationReceipt(orderId: string) {
  const auth = await requireUser()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      OR: [{ userId: auth.user.id }, { customerEmail: auth.user.email }]
    },
    select: { paymentIntentId: true }
  })

  if (!order?.paymentIntentId) return { success: false, data: null, error: 'Receipt not available' }

  try {
    const intent = (await stripe.paymentIntents.retrieve(order.paymentIntentId, {
      expand: ['latest_charge']
    })) as any

    const url = intent.latest_charge?.receipt_url ?? null

    if (!url) return { success: false, data: null, error: 'Receipt not available' }

    return { success: true, data: { url }, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch donation receipt', {
      userId: auth.user.id,
      orderId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    return { success: false, data: null, error: 'Could not load the receipt' }
  }
}
