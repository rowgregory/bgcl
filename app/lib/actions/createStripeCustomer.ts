'use server'

import prisma from '@/prisma/client'
import { stripe } from '../stripe/stripeClient'

export async function createStripeCustomer(userId: string, email: string, name: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })

    // Already has a customer ID
    if (existingUser?.stripeCustomerId) {
      return {
        success: true,
        customerId: existingUser.stripeCustomerId
      }
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId
      }
    })

    // Save to database
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id }
    })

    return {
      success: true,
      customerId: customer.id
    }
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    return {
      success: false,
      error: 'Failed to create customer'
    }
  }
}
