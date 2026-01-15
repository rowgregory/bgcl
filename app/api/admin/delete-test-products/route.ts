import { stripe } from '@/app/lib/stripe/stripeClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    let deletedPrices = 0
    let deletedProducts = 0
    const errors: string[] = []

    try {
      // Delete all prices FIRST
      let hasMore = true
      let startingAfter = undefined

      while (hasMore) {
        const prices = await stripe.prices.list({
          limit: 100,
          starting_after: startingAfter as any
        })

        for (const price of prices.data) {
          try {
            await stripe.prices.update(price.id, { active: false })
            deletedPrices++
          } catch (error) {
            errors.push(`Error with price ${price.id}`)
          }
        }

        hasMore = prices.has_more
        if (hasMore && prices.data.length > 0) {
          startingAfter = prices.data[prices.data.length - 1].id
        }
      }

      console.log(`Deactivated ${deletedPrices} prices`)
    } catch (error) {
      console.error('Error deactivating prices:', error)
      errors.push(`Error with prices: ${error}`)
    }

    try {
      // Now delete all products
      let hasMore = true
      let startingAfter = undefined

      while (hasMore) {
        const products = await stripe.products.list({
          limit: 100,
          starting_after: startingAfter as any
        })

        for (const product of products.data) {
          try {
            await stripe.products.del(product.id)
            deletedProducts++
          } catch (error) {
            errors.push(`Error deleting ${product.id}: ${error}`)
          }
        }

        hasMore = products.has_more
        if (hasMore && products.data.length > 0) {
          startingAfter = products.data[products.data.length - 1].id
        }
      }

      console.log(`Deleted ${deletedProducts} products`)
    } catch (error) {
      console.error('Error deleting products:', error)
      errors.push(`Error deleting products: ${error}`)
    }

    return NextResponse.json({
      deletedPrices,
      deletedProducts,
      errors,
      message: 'Test products cleaned up'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed', details: String(error) }, { status: 500 })
  }
}
