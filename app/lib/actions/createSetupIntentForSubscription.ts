'use server'

import prisma from '@/prisma/client'
import { stripe } from '../stripe/stripeClient'

interface SetupIntentParams {
  userId?: string
  email: string
  name: string
  amount: number // in cents
  frequency: 'monthly' | 'yearly'
}

export async function createSetupIntentForSubscription({ userId, email, name, amount, frequency }: SetupIntentParams) {
  try {
    let customerId: string | undefined

    if (userId) {
      // Logged-in user - customer should already exist from signup
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true }
      })

      if (user?.stripeCustomerId) {
        customerId = user.stripeCustomerId
      }
    } else {
      // Not logged in - check if user exists by email
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { stripeCustomerId: true }
      })

      if (existingUser?.stripeCustomerId) {
        customerId = existingUser.stripeCustomerId
      } else {
        // Try to find existing Stripe customer by email
        const stripeCustomers = await stripe.customers.list({
          email,
          limit: 10
        })

        if (stripeCustomers.data.length > 0) {
          // Found existing customer - use it
          customerId = stripeCustomers.data[0].id
          console.log('Found existing guest customer:', customerId)
        } else {
          // No customer exists - create new one
          const customer = await stripe.customers.create({
            email,
            name,
            description: `Guest donor: ${name}`,
            metadata: {
              userId: 'guest',
              createdAt: new Date().toISOString()
            }
          })
          customerId = customer.id
          console.log('New guest customer created:', customerId)
        }
      }
    }

    // Create SetupIntent for client to confirm card
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        userId: userId || 'guest',
        email,
        name,
        frequency,
        amount: amount.toString(),
        type: 'recurring_donation'
      }
    })

    console.log('SetupIntent created:', setupIntent.id)

    return {
      success: true,
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
      customerId
    }
  } catch (error) {
    console.error('SetupIntent creation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create setup intent'
    }
  }
}
