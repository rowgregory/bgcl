import prisma from '@/prisma/client'
import { auth } from '../../auth/auth'
import { createLog } from '../log/createLog'

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
    const totalTickets = totalTicketCount

    const recentDonations = donationOrders.slice(0, 3)

    // Build upcomingEvents from a deep copy so ticketOrders is never mutated
    const upcomingEvents = ticketOrders
      .filter((o) => {
        const event = o.event ?? o.orderItems[0]?.ticket?.event
        return event?.date && new Date(event.date) >= new Date()
      })
      .sort((a, b) => {
        const aDate = a.event?.date ?? a.orderItems[0]?.ticket?.event?.date
        const bDate = b.event?.date ?? b.orderItems[0]?.ticket?.event?.date
        return new Date(aDate!).getTime() - new Date(bDate!).getTime()
      })
      .reduce<
        {
          eventId: string
          event: (typeof ticketOrders)[0]['event']
          orderIds: string[]
          orderItems: {
            ticketName: string
            quantity: number
            pricePerUnit: number
            totalPrice: number
            raffleTickets: { number: number; code: string }[]
          }[]
          totalAmount: number
          createdAt: string
        }[]
      >((acc, order) => {
        const event = order.event ?? order.orderItems[0]?.ticket?.event
        const eventId = order.eventId ?? event?.id ?? 'unknown'
        const existing = acc.find((g) => g.eventId === eventId)

        const mappedItems = order.orderItems.map((item) => ({
          ticketName: item.ticketName,
          quantity: item.quantity ?? 1,
          pricePerUnit: item.pricePerUnit,
          totalPrice: item.totalPrice ?? 0,
          raffleTickets:
            item.raffleTicketNumber && item.raffleTicketCode
              ? [{ number: item.raffleTicketNumber, code: item.raffleTicketCode }]
              : []
        }))

        if (existing) {
          mappedItems.forEach((incoming) => {
            const match = existing.orderItems.find((i) => i.ticketName === incoming.ticketName)
            if (match) {
              match.quantity += incoming.quantity
              match.totalPrice += incoming.totalPrice
              match.raffleTickets.push(...incoming.raffleTickets)
            } else {
              existing.orderItems.push({ ...incoming })
            }
          })
          existing.totalAmount += order.totalAmount
          existing.orderIds.push(order.id)
        } else {
          // When first creating the group, also merge duplicate ticketNames
          // within the same order (raffle tickets are 1 row each)
          const mergedItems: typeof mappedItems = []
          mappedItems.forEach((item) => {
            const match = mergedItems.find((i) => i.ticketName === item.ticketName)
            if (match) {
              match.quantity += item.quantity
              match.totalPrice += item.totalPrice
              match.raffleTickets.push(...item.raffleTickets)
            } else {
              mergedItems.push({ ...item })
            }
          })

          acc.push({
            eventId,
            event,
            orderIds: [order.id],
            orderItems: mergedItems,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt.toString()
          })
        }

        return acc
      }, [])
      .slice(0, 3)

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
      donationOrders: donationOrders.map((o) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
        feesCovered: Number(o.feesCovered)
      })),
      ticketOrders: ticketOrders.slice(0, 3).map((o) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
        feesCovered: Number(o.feesCovered),
        orderItems: o.orderItems.map((item) => ({
          ...item,
          pricePerUnit: item.pricePerUnit ? Number(item.pricePerUnit) : null,
          totalPrice: item.totalPrice ? Number(item.totalPrice) : null
        }))
      })),
      totalDonated: Number(totalDonated),
      monthlyCount,
      yearlyCount,
      monthlyAmount: Number(monthlyAmount),
      yearlyAmount: Number(yearlyAmount),
      upcomingEvents,
      totalTickets,
      recentDonations: recentDonations.map((o) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
        feesCovered: Number(o.feesCovered)
      })),
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
