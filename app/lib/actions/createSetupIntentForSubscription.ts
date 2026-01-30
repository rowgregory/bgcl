'use server'

import prisma from '@/prisma/client'
import { stripe } from '../stripe/stripeClient'
import { createLog } from './createLog'

interface SetupIntentParams {
  userId?: string
  email: string
  name: string
  amount: number // in cents
  frequency: 'monthly' | 'yearly'
  coverFees?: boolean
  feesCovered?: number
}

export async function createSetupIntentForSubscription({
  userId,
  email,
  name,
  amount,
  frequency,
  coverFees,
  feesCovered
}: SetupIntentParams) {
  try {
    // VALIDATE MINIMUM AMOUNT
    if (amount < 500) {
      // Stripe uses cents, so $5 = 500
      throw new Error('Minimum donation is $5')
    }

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
    }

    // If no customer ID yet (logged in user without one, or guest), create customer
    if (!customerId) {
      // Check if customer exists in Stripe by email
      const stripeCustomers = await stripe.customers.list({
        email,
        limit: 1
      })

      if (stripeCustomers.data.length > 0) {
        // Found existing customer - use it
        customerId = stripeCustomers.data[0].id
        console.log('Found existing customer:', customerId)
      } else {
        // No customer exists - create new one
        const customer = await stripe.customers.create({
          email,
          name,
          description: userId ? 'Platform user' : `Guest donor: ${name}`,
          metadata: {
            userId: userId || 'guest',
            createdAt: new Date().toISOString()
          }
        })
        customerId = customer.id
        console.log('New customer created:', customerId)

        // If logged-in user, save the customer ID to database
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId }
          })
        }
      }
    }

    // Create SetupIntent - customer is guaranteed to exist now
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId, // ✅ Now guaranteed to be a valid customer ID
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        userId: userId || 'guest',
        email,
        name,
        frequency,
        amount: amount.toString(),
        type: 'recurring_donation',
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: feesCovered?.toString() || '0'
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
    await createLog('error', 'SetupIntent creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email,
      name
    })

    return {
      success: false,
      error: 'Failed to create setup intent'
    }
  }
}
