'use server'

import prisma from '@/prisma/client'

export async function validateCart(lines: { ticketId: string; price: number }[]) {
  if (lines.length === 0) return { success: true, data: { stale: [] }, error: null }

  const tickets = await prisma.ticket.findMany({
    where: { id: { in: lines.map((l) => l.ticketId) } },
    select: { id: true, price: true, totalQuantity: true, quantitySold: true }
  })

  const stale = lines
    .filter((line) => {
      const ticket = tickets.find((t) => t.id === line.ticketId)

      // Gone entirely, sold out, or repriced
      if (!ticket) return true
      if (ticket.totalQuantity - ticket.quantitySold <= 0) return true

      return Number(ticket.price) !== line.price
    })
    .map((l) => l.ticketId)

  return { success: true, data: { stale }, error: null }
}
