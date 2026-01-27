'use server'

import prisma from '@/prisma/client'
import { auth } from '../auth'
import { stripe } from '../stripe/stripeClient'

export async function getSetupIntentClientSecret() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    // Get or create Stripe customer
    let customerId: string

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true }
    })

    if (user?.stripeCustomerId) {
      customerId = user.stripeCustomerId
    } else {
      const customer = await stripe.customers.create({
        email: session.user.email || undefined,
        metadata: {
          userId: session.user.id
        }
      })
      customerId = customer.id

      // Save to user
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card']
    })

    return {
      success: true,
      clientSecret: setupIntent.client_secret
    }
  } catch (error) {
    console.error('Error creating setup intent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get client secret'
    }
  }
}
