import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

const DAY_MS = 86_400_000

const CONFIRMED_TICKET_ORDERS = { type: 'TICKET_PURCHASE', status: 'CONFIRMED' } as const

/**
 * Seats come from the tickets themselves, so a table counts for ten and an ad
 * counts for none. Revenue is net of the fees buyers chose to cover, since that
 * money goes to Stripe rather than the club.
 */
const summarizeOrders = (orders: any[]) => {
  const lines = orders.flatMap((order) =>
    (order.orderItems ?? []).map((item: any) => {
      const perTicket = item.ticket?.guestCount ?? 1

      return { quantity: item.quantity, seats: perTicket * item.quantity, admits: perTicket > 0 }
    })
  )

  const admitting = lines.filter((line) => line.admits)
  const nonAdmitting = lines.filter((line) => !line.admits)

  const grossCharged = orders.reduce((sum, order) => sum + Number(order.totalAmount ?? 0), 0)
  const feesCovered = orders.reduce((sum, order) => sum + Number(order.feesCovered ?? 0), 0)

  return {
    sold: admitting.reduce((sum, line) => sum + line.quantity, 0),
    nonTicketItems: nonAdmitting.reduce((sum, line) => sum + line.quantity, 0),
    seats: admitting.reduce((sum, line) => sum + line.seats, 0),
    orders: orders.length,
    grossCharged,
    feesCovered,
    revenue: grossCharged - feesCovered
  }
}

const saleWindow = (event: any, now: number, startOfToday: number) => {
  const opensAt = event.ticketSalesStartDate ? new Date(event.ticketSalesStartDate) : null
  const closesAt = event.ticketSalesEndDate ? new Date(event.ticketSalesEndDate) : null

  const daysUntil = (date: Date | null) => (date ? Math.ceil((date.getTime() - startOfToday) / DAY_MS) : null)

  let status = 'always'

  if (opensAt && now < opensAt.getTime()) status = 'scheduled'
  else if (closesAt && now > closesAt.getTime()) status = 'closed'
  else if (opensAt || closesAt) status = 'open'

  return {
    status,
    opensAt,
    closesAt,
    daysUntilOpen: daysUntil(opensAt),
    daysUntilClose: daysUntil(closesAt)
  }
}

const buildAlerts = (upcoming: any[]) => {
  const alerts = []

  for (const event of upcoming) {
    if (event.totals.capacity > 0 && event.totals.pctSold >= 90) {
      alerts.push({
        id: `${event.id}-sellout`,
        tone: 'amber',
        title: event.title,
        detail: `${event.totals.capacity - event.totals.seats} seats left, ${event.totals.pctSold}% sold`
      })
    }

    if (event.daysAway <= 14 && event.totals.capacity > 0 && event.totals.pctSold < 40) {
      alerts.push({
        id: `${event.id}-slow`,
        tone: 'violet',
        title: event.title,
        detail: `${event.daysAway} days out, only ${event.totals.pctSold}% sold`
      })
    }

    if (event.totals.capacity === 0) {
      alerts.push({
        id: `${event.id}-notickets`,
        tone: 'neutral',
        title: event.title,
        detail: 'no ticket types configured'
      })
    }
  }

  return alerts.slice(0, 5)
}

export async function getEventsOverview() {
  const auth = await requireAdmin()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    const events = await prisma.event.findMany({
      include: {
        tickets: true,
        orders: {
          where: CONFIRMED_TICKET_ORDERS,
          include: { orderItems: { include: { ticket: { select: { guestCount: true } } } } }
        }
      },
      orderBy: { date: 'asc' }
    })

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const startMs = startOfToday.getTime()
    const now = Date.now()

    // One flat summary per event. Orders and their items stay on the server.
    const summaries = events.map((event) => {
      const totals = summarizeOrders(event.orders)
      const capacity = event.capacity ?? event.tickets.reduce((sum, t) => sum + (t.totalQuantity ?? 0), 0)

      return {
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        status: event.status,
        daysAway: Math.round((new Date(event.date).getTime() - startMs) / DAY_MS),
        sale: saleWindow(event, now, startMs),
        totals: {
          ...totals,
          capacity,
          pctSold: capacity > 0 ? Math.round((totals.seats / capacity) * 100) : 0
        }
      }
    })

    const upcoming = summaries.filter((event) => event.daysAway >= 0).sort((a, b) => a.daysAway - b.daysAway)
    const past = summaries.filter((event) => event.daysAway < 0)

    const withSales = summaries
      .filter((event) => event.totals.revenue > 0 || event.totals.sold > 0)
      .sort((a, b) => b.totals.revenue - a.totals.revenue)

    // Every ticket type sold, ads included. This is a sales report, not a headcount.
    const itemMap = new Map<string, { name: string; sold: number; revenue: number }>()

    for (const event of events) {
      for (const ticket of event.tickets) {
        const row = itemMap.get(ticket.name) ?? { name: ticket.name, sold: 0, revenue: 0 }

        row.sold += ticket.quantitySold ?? 0
        row.revenue += (ticket.quantitySold ?? 0) * Number(ticket.price)
        itemMap.set(ticket.name, row)
      }
    }

    const byItem = [...itemMap.values()].filter((item) => item.sold > 0).sort((a, b) => b.sold - a.sold)

    return {
      success: true,
      data: {
        stats: {
          ticketRevenue: summaries.reduce((sum, event) => sum + event.totals.revenue, 0),
          grossCharged: summaries.reduce((sum, event) => sum + event.totals.grossCharged, 0),
          totalFeesCovered: summaries.reduce((sum, event) => sum + event.totals.feesCovered, 0),
          totalTicketsSold: summaries.reduce((sum, event) => sum + event.totals.sold, 0),
          totalSeatsSold: summaries.reduce((sum, event) => sum + event.totals.seats, 0),
          totalEvents: events.length,
          upcomingCount: upcoming.length,
          pastCount: past.length,
          totalNonTicketItems: summaries.reduce((sum, event) => sum + event.totals.nonTicketItems, 0)
        },
        nextEvent: upcoming[0] ?? null,
        topEvent: withSales[0] ?? null,
        alerts: buildAlerts(upcoming),
        byEvent: withSales.slice(0, 8),
        byItem,
        totalItemsSold: byItem.reduce((sum, item) => sum + item.sold, 0)
      },
      error: null
    }
  } catch (error) {
    await createLog('error', 'Error fetching events overview data', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load events overview' }
  }
}
