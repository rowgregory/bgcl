'use client'

import { useMemo } from 'react'
import { grossUpCents } from '@/lib/utils/stripeFees'

type PricedItem = { price: number; quantity: number }

/**
 * The one place the ticket fee is derived on the client. Everything is integer
 * cents past the subtotal, so the summary, the toggle and the pay button all
 * show the same figures the server charges.
 */
export function useTicketTotals(items: PricedItem[], coverFees: boolean) {
  return useMemo(() => {
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const baseAmountInCents = Math.round(totalPrice * 100)

    // grossUpCents on an empty cart still returns the fixed 30c component
    const feeCents = baseAmountInCents > 0 ? grossUpCents(baseAmountInCents) : 0

    return {
      baseAmountInCents,
      feeCents,
      finalAmount: baseAmountInCents + (coverFees ? feeCents : 0)
    }
  }, [items, coverFees])
}
