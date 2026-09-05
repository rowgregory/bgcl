import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

type SubscriptionSummary = {
  amount: number
  frequency: string | null
  isActive: boolean
  collected: number
}

type UpcomingEventItem = {
  ticketName: string
  quantity: number
  pricePerUnit: number | null
  totalPrice: number
  raffleTickets: { number: number; code: string }[]
}

export async function getSupporterDashboard() {
  const auth = await requireUser()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    const [orders, user, upcomingEvents] = await Promise.all([
      prisma.order.findMany({
        where: { OR: [{ userId: auth.user.id }, { customerEmail: auth.user.email }] },
        include: {
          orderItems: { include: { ticket: { include: { event: true } } } },
          event: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.findUnique({
        where: { id: auth.user.id },
        select: { createdAt: true }
      }),
      prisma.event.findMany({
        where: {
          date: { gte: new Date() },
          isPublic: true
        },
        orderBy: { date: 'asc' },
        take: 3,
        select: {
          id: true,
          title: true,
          date: true,
          location: true,
          ticketSalesStartDate: true,
          ticketSalesEndDate: true
        }
      })
    ])

    // ── Donations ──────────────────────────────────────────────────────────
    const donationOrders = orders.filter(
      (o) =>
        (o.type === 'ONE_TIME_DONATION' || o.type === 'RECURRING_DONATION') &&
        (o.status === 'CONFIRMED' || o.status === 'PROCESSING' || o.status === 'CANCELLED')
    )

    // A recurring donation writes one order row per billing cycle, so a $25/mo
    // donor of a year has twelve rows. Collapsing them by subscription id is
    // what makes "3 donations" mean three donations rather than three charges.
    // Rows arrive newest first, so the first one seen carries the current amount.
    const subscriptions = new Map<string, SubscriptionSummary>()

    let oneTimeTotal = 0
    let oneTimeCount = 0

    for (const order of donationOrders) {
      // PROCESSING and CANCELLED cycles never took money, so they add nothing
      // to the total even though they belong to the donation's history
      const collected = order.status === 'CONFIRMED' ? Number(order.totalAmount) : 0

      if (order.type !== 'RECURRING_DONATION' || !order.stripeSubscriptionId) {
        oneTimeTotal += collected
        if (collected > 0) oneTimeCount += 1
        continue
      }

      const existing = subscriptions.get(order.stripeSubscriptionId)

      if (existing) {
        existing.collected += collected
        continue
      }

      subscriptions.set(order.stripeSubscriptionId, {
        amount: Number(order.totalAmount),
        frequency: order.recurringFrequency,
        // The webhook stamps every cycle of a cancelled subscription, so any
        // row of it answers whether the subscription is still running
        isActive: !order.subscriptionCanceledAt,
        collected
      })
    }

    const subs = Array.from(subscriptions.values())
    const activeSubs = subs.filter((s) => s.isActive)

    const byFrequency = (list: SubscriptionSummary[], frequency: string) => list.filter((s) => s.frequency === frequency)

    // Recurring support is what will be charged next period, so it sums the
    // per-cycle amount of each active subscription, not everything collected
    const monthlyAmount = byFrequency(activeSubs, 'monthly').reduce((sum, s) => sum + s.amount, 0)
    const yearlyAmount = byFrequency(activeSubs, 'yearly').reduce((sum, s) => sum + s.amount, 0)

    const activeMonthly = byFrequency(activeSubs, 'monthly').length
    const activeYearly = byFrequency(activeSubs, 'yearly').length
    const endedMonthly = byFrequency(subs, 'monthly').length - activeMonthly

    const totalDonated = oneTimeTotal + subs.reduce((sum, s) => sum + s.collected, 0)
    const donationCount = oneTimeCount + subs.length

    // ── Tickets ────────────────────────────────────────────────────────────
    const ticketOrders = orders.filter((o) => o.type === 'TICKET_PURCHASE' && o.status === 'CONFIRMED')

    const totalTicketSpend = ticketOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0)
    const totalTickets = ticketOrders.reduce((sum, o) => sum + o.orderItems.reduce((s, i) => s + i.quantity, 0), 0)

    // Someone can buy tickets to the same event across several orders, and a
    // raffle writes one order item per ticket, so this collapses twice: once by
    // event, then by ticket name within that event
    const myUpcomingEvents = ticketOrders
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
          orderItems: UpcomingEventItem[]
          totalAmount: number
          createdAt: string
        }[]
      >((acc, order) => {
        const event = order.event ?? order.orderItems[0]?.ticket?.event
        const eventId = order.eventId ?? event?.id ?? 'unknown'

        const incoming: UpcomingEventItem[] = order.orderItems.map((item) => ({
          ticketName: item.ticketName,
          quantity: item.quantity ?? 1,
          pricePerUnit: item.pricePerUnit ? Number(item.pricePerUnit) : null,
          totalPrice: Number(item.totalPrice ?? 0),
          raffleTickets:
            item.raffleTicketNumber && item.raffleTicketCode
              ? [{ number: item.raffleTicketNumber, code: item.raffleTicketCode }]
              : []
        }))

        const group =
          acc.find((g) => g.eventId === eventId) ??
          (acc.push({
            eventId,
            event,
            orderIds: [],
            orderItems: [],
            totalAmount: 0,
            createdAt: order.createdAt.toISOString()
          }),
          acc[acc.length - 1])

        for (const item of incoming) {
          const match = group.orderItems.find((i) => i.ticketName === item.ticketName)

          if (match) {
            match.quantity += item.quantity
            match.totalPrice += item.totalPrice
            match.raffleTickets.push(...item.raffleTickets)
            continue
          }

          group.orderItems.push({ ...item })
        }

        group.totalAmount += Number(order.totalAmount)
        group.orderIds.push(order.id)

        return acc
      }, [])
      .slice(0, 3)

    const totalSpend = totalDonated + totalTicketSpend
    const joinYear = user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : null

    const myEventIds = new Set(myUpcomingEvents.map((g) => g.eventId))

    return {
      success: true,
      error: null,
      data: {
        totalDonated,
        donationCount,
        monthlyAmount,
        yearlyAmount,
        activeMonthly,
        activeYearly,
        totalTickets,
        totalTicketSpend,
        totalSpend,
        joinYear,
        myUpcomingEvents,
        upcomingEvents: upcomingEvents.map((event) => ({
          ...event,
          date: event.date.toISOString(),
          ticketSalesStartDate: event.ticketSalesStartDate?.toISOString() ?? null,
          ticketSalesEndDate: event.ticketSalesEndDate?.toISOString() ?? null,
          hasTickets: myEventIds.has(event.id)
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
        hero: {
          label: 'Total contributed',
          value: totalSpend,
          subtext: `${donationCount} ${donationCount === 1 ? 'donation' : 'donations'} and ${totalTickets} ${totalTickets === 1 ? 'ticket' : 'tickets'}`
        },
        stats: [
          {
            label: 'Donations',
            value: totalDonated,
            subtext: `${donationCount} ${donationCount === 1 ? 'donation' : 'donations'}`
          },
          {
            label: 'Monthly support',
            value: monthlyAmount,
            subtext: activeMonthly > 0 ? `${activeMonthly} active` : endedMonthly > 0 ? `${endedMonthly} ended` : 'none active'
          },
          ...(activeYearly > 0 ? [{ label: 'Yearly support', value: yearlyAmount, subtext: `${activeYearly} active` }] : []),
          {
            label: 'Event tickets',
            value: totalTicketSpend,
            subtext: `${totalTickets} ${totalTickets === 1 ? 'ticket' : 'tickets'}`
          }
        ]
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch supporter dashboard data', {
      userId: auth.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load supporter dashboard data.' }
  }
}
