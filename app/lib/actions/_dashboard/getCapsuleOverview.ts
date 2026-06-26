import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

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
    const totalAttendees = events.reduce((sum, e) => sum + (e.guestCount ?? 0), 0)

    const upcomingEvents = events.filter(
      (e) => (e.status === 'UPCOMING' || e.status === 'ONGOING') && new Date(e.date) > now
    )
    const pastEvents = events.filter((e) => e.status === 'COMPLETED' || new Date(e.date) < now)
    const totalEvents = events.length

    const recentOrders = ticketOrders.slice(0, 10)

    return {
      stats: {
        totalRevenue: Number(totalRevenue),
        totalTicketsSold,
        totalAttendees,
        totalEvents,
        upcomingCount: upcomingEvents.length,
        pastCount: pastEvents.length
      },
      upcomingEvents: upcomingEvents.slice(0, 5).map((e) => ({
        ...e,
        tickets: e.tickets.map((t) => ({
          ...t,
          price: Number(t.price)
        })),
        orders: e.orders.map((o) => ({
          ...o,
          totalAmount: Number(o.totalAmount),
          feesCovered: Number(o.feesCovered),
          orderItems: o.orderItems.map((i) => ({
            ...i,
            pricePerUnit: i.pricePerUnit ? Number(i.pricePerUnit) : null,
            totalPrice: i.totalPrice ? Number(i.totalPrice) : null
          }))
        }))
      })),
      recentOrders: recentOrders.map((o) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
        feesCovered: Number(o.feesCovered),
        orderItems: o.orderItems.map((i) => ({
          ...i,
          pricePerUnit: i.pricePerUnit ? Number(i.pricePerUnit) : null,
          totalPrice: i.totalPrice ? Number(i.totalPrice) : null
        }))
      })),
      events: events.map((e) => ({
        ...e,
        tickets: e.tickets.map((t) => ({
          ...t,
          price: Number(t.price)
        })),
        orders: e.orders.map((o) => ({
          ...o,
          totalAmount: Number(o.totalAmount),
          feesCovered: Number(o.feesCovered),
          orderItems: o.orderItems.map((i) => ({
            ...i,
            pricePerUnit: i.pricePerUnit ? Number(i.pricePerUnit) : null,
            totalPrice: i.totalPrice ? Number(i.totalPrice) : null
          }))
        }))
      }))
    }
  } catch (error) {
    await createLog('error', 'Error fetching capsule overview data', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
