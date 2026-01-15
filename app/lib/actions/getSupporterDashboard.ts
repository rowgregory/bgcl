import prisma from '@/prisma/client'
import { auth } from '../auth'

export async function getSupporterDashboard() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  // Get all orders for this user
  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      orderItems: {
        include: {
          ticket: true
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
      (o.status === 'CONFIRMED' || o.status === 'PROCESSING')
  )
  const ticketOrders = orders.filter((o) => o.type === 'TICKET_PURCHASE' && o.status === 'CONFIRMED')

  // Calculate totals
  const totalDonated = donationOrders.reduce((sum, o) => sum + o.totalAmount, 0)

  const monthlyCount = donationOrders.filter((o) => o.recurringFrequency === 'monthly').length
  const yearlyCount = donationOrders.filter((o) => o.recurringFrequency === 'yearly').length

  const monthlyAmount =
    monthlyCount > 0
      ? donationOrders.filter((o) => o.recurringFrequency === 'monthly').reduce((sum, o) => sum + o.totalAmount, 0)
      : 0

  const yearlyAmount =
    yearlyCount > 0
      ? donationOrders.filter((o) => o.recurringFrequency === 'yearly').reduce((sum, o) => sum + o.totalAmount, 0)
      : 0

  const upcomingEvents = ticketOrders.filter((o) => o.event && new Date(o.event.date) > new Date()).slice(0, 3)

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
        value: `$${(monthlyCount * 25).toFixed(2)}`,
        subtext: `${monthlyCount} active plans`,
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
        value: totalTickets.toString(),
        subtext: `${ticketOrders.length} purchases`,
        icon: 'Ticket',
        color: 'text-sky-400',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/30'
      },
      {
        label: 'Member Since',
        value: joinYear,
        subtext: 'Active supporter',
        icon: 'Calendar',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30'
      }
    ]
  }
}
