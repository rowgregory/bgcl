import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import { stripe } from '@/app/lib/stripe/stripeClient'

export async function POST(_: NextRequest) {
  try {
    let deletedCustomers = 0
    let deletedOrders = 0
    const errors: string[] = []

    try {
      // Get all customers
      let hasMore = true
      let startingAfter = undefined

      while (hasMore) {
        const customers = await stripe.customers.list({
          limit: 100,
          starting_after: startingAfter as any
        })

        for (const customer of customers.data) {
          try {
            // Cancel all subscriptions for this customer first
            const subs = await stripe.subscriptions.list({
              customer: customer.id,
              limit: 100
            })

            for (const sub of subs.data) {
              await stripe.subscriptions.cancel(sub.id)
            }

            // Then delete the customer
            await stripe.customers.del(customer.id)
            deletedCustomers++
          } catch (error) {
            errors.push(`Error with customer ${customer.id}: ${error}`)
          }
        }

        hasMore = customers.has_more
        if (hasMore) {
          startingAfter = customers.data[customers.data.length - 1].id
        }
      }
    } catch (error) {
      errors.push(`Error listing customers: ${error}`)
    }

    try {
      // Delete all orders from database
      const result = await prisma.order.deleteMany({
        where: {
          type: {
            in: ['ONE_TIME_DONATION', 'RECURRING_DONATION']
          }
        }
      })
      deletedOrders = result.count
    } catch (error) {
      errors.push(`Error deleting orders: ${error}`)
    }

    return NextResponse.json({
      deletedCustomers,
      deletedOrders,
      errors,
      message: 'Test data cleared'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear test data' }, { status: 500 })
  }
}
