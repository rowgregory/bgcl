import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function getCapsuleOverview() {
  try {
    const [events, ticketOrders] = await Promise.all([
      prisma.event.findMany({
        include: {
          tickets: true,
          orders: {
            where: { type: 'TICKET_PURCHASE', status: 'CONFIRMED' },
            include: { orderItems: true }
          }
        },
        orderBy: { date: 'asc' }
      }),
      prisma.order.findMany({
        where: { type: 'TICKET_PURCHASE', status: 'CONFIRMED' },
        include: { orderItems: { include: { ticket: { include: { event: true } } } } },
        orderBy: { createdAt: 'desc' }
      })
    ])

    const now = new Date()

    const totalRevenue = ticketOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const totalTicketsSold = ticketOrders.reduce((sum, o) => sum + o.orderItems.reduce((s, i) => s + i.quantity, 0), 0)
    const totalAttendees = events.reduce((sum, e) => sum + e.attendeeCount, 0)
    const upcomingEvents = events.filter((e) => e.status === 'UPCOMING' && new Date(e.date) > now)
    const pastEvents = events.filter((e) => e.status === 'COMPLETED' || new Date(e.date) < now)
    const totalEvents = events.length

    const recentOrders = ticketOrders.slice(0, 10)

    return {
      stats: {
        totalRevenue,
        totalTicketsSold,
        totalAttendees,
        totalEvents,
        upcomingCount: upcomingEvents.length,
        pastCount: pastEvents.length
      },
      upcomingEvents: upcomingEvents.slice(0, 5),
      recentOrders,
      allEvents: events
    }
  } catch (error) {
    await createLog('error', 'Error fetching capsule overview data', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
