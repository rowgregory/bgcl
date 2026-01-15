import { stripe } from '@/app/lib/stripe/stripeClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(_: NextRequest) {
  try {
    let refunded = 0
    const errors: string[] = []

    try {
      // Get all charges
      let hasMore = true
      let startingAfter = undefined

      while (hasMore) {
        const charges = await stripe.charges.list({
          limit: 100,
          starting_after: startingAfter as any
        })

        for (const charge of charges.data) {
          // Only refund charges that succeeded and aren't already refunded
          if (charge.refunded === false && charge.status === 'succeeded') {
            try {
              await stripe.refunds.create({
                charge: charge.id
              })
              refunded++
            } catch (error) {
              errors.push(`Error refunding ${charge.id}: ${error}`)
            }
          }
        }

        hasMore = charges.has_more
        if (hasMore) {
          startingAfter = charges.data[charges.data.length - 1].id
        }
      }
    } catch (error) {
      errors.push(`Error listing charges: ${error}`)
    }

    return NextResponse.json({
      refunded,
      errors,
      message: 'Test charges refunded'
    })
  } catch (error) {
    console.error('Error refunding test charges:', error)
    return NextResponse.json({ error: 'Failed to refund charges' }, { status: 500 })
  }
}
