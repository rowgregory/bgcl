import prisma from '@/prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'

export async function getSupporterDashboard() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Not authenticated')
    }

    // Get all orders for this user
    const orders = await prisma.order.findMany({
      where: {
        OR: [{ userId: session.user.id }, { customerEmail: session.user.email }]
      },
      include: {
        orderItems: {
          include: {
            ticket: {
              include: {
                event: true
              }
            }
          }
        },
        event: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter by type and status
    const donationOrders = orders.filter(
      (o) =>
        (o.type === 'ONE_TIME_DONATION' || o.type === 'RECURRING_DONATION') &&
        (o.status === 'CONFIRMED' || o.status === 'PROCESSING' || o.status === 'CANCELLED')
    )

    // Calculate totals
    const totalDonated = donationOrders.reduce((sum, o) => sum + o.totalAmount, 0)

    const monthlyCount = donationOrders.filter((o) => o.recurringFrequency === 'monthly').length
    const yearlyCount = donationOrders.filter((o) => o.recurringFrequency === 'yearly').length

    const monthlyAmount =
      monthlyCount > 0
        ? donationOrders
            .filter((o) => o.recurringFrequency === 'monthly' && o.status === 'CONFIRMED')
            .reduce((sum, o) => sum + o.totalAmount, 0)
        : 0

    const yearlyAmount =
      yearlyCount > 0
        ? donationOrders.filter((o) => o.recurringFrequency === 'yearly').reduce((sum, o) => sum + o.totalAmount, 0)
        : 0

    const ticketOrders = orders.filter((o) => o.type === 'TICKET_PURCHASE' && o.status === 'CONFIRMED')
    const totalTicketSpend = ticketOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const totalTicketCount = ticketOrders.reduce((sum, o) => sum + o.orderItems.reduce((s, i) => s + i.quantity, 0), 0)

    const upcomingEvents = ticketOrders
      .sort((a, b) => new Date(a.event!.date).getTime() - new Date(b.event!.date).getTime())
      .slice(0, 3)

    const totalTickets = ticketOrders.reduce(
      (sum, o) => sum + o.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    )

    const recentDonations = donationOrders.slice(0, 3)

    // Get user's join date
    const userCreatedAt = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { createdAt: true }
    })

    const joinYear = userCreatedAt?.createdAt ? new Date(userCreatedAt.createdAt).getFullYear().toString() : '2026'

    const activeMonthly = donationOrders.filter(
      (o) => o.recurringFrequency === 'monthly' && o.status === 'CONFIRMED'
    ).length
    const cancelledMonthly = donationOrders.filter(
      (o) => o.recurringFrequency === 'monthly' && o.status === 'CANCELLED'
    ).length

    const totalSpend = totalDonated + totalTicketSpend

    return {
      donationOrders,
      ticketOrders,
      totalDonated,
      monthlyCount,
      yearlyCount,
      monthlyAmount,
      yearlyAmount,
      upcomingEvents,
      totalTickets,
      recentDonations,
      joinYear,
      stats: [
        {
          label: 'Total Donated',
          value: `$${totalDonated.toFixed(2)}`,
          subtext: `${donationOrders.length} donations`,
          icon: 'Heart',
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30'
        },
        {
          label: 'Monthly Support',
          value: `$${monthlyAmount.toFixed(2)}`,
          subtext:
            activeMonthly > 0 && cancelledMonthly > 0
              ? `${activeMonthly} active, ${cancelledMonthly} cancelled`
              : activeMonthly > 0
                ? `${activeMonthly} active`
                : cancelledMonthly > 0
                  ? `${cancelledMonthly} cancelled`
                  : '0 plans',
          icon: 'Zap',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30'
        },
        {
          label: 'Yearly Support',
          value: yearlyCount > 0 ? `$${yearlyAmount.toFixed(2)}` : '$0',
          subtext: `${yearlyCount} active`,
          icon: 'Zap',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30'
        },
        {
          label: 'Event Tickets',
          value: `$${totalTicketSpend.toFixed(2)}`,
          subtext: `${totalTicketCount} ticket${totalTicketCount !== 1 ? 's' : ''} purchased`,
          icon: 'Ticket',
          color: 'text-green-400',
          bg: 'bg-green-500/10',
          border: 'border-green-500/30'
        },
        {
          label: 'Total Spent',
          value: `$${totalSpend.toFixed(2)}`,
          subtext: `donations & tickets`,
          icon: 'DollarSign',
          color: 'text-sky-400',
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/30'
        }
      ]
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch supporter dashboard data', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to fetch supporter dashboard data. Please try again.'
    }
  }
}
