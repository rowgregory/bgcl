'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'
import { OrderStatus } from '@prisma/client'

export interface RecentOrder {
  id: string
  createdAt: Date
  type: string
  status: string
  totalAmount: number
  customerName: string | null
  user: { firstName: string | null; lastName: string | null; email: string } | null
  event: { title: string } | null
}

export interface DashboardStats {
  totalRevenue: number
  revenueThisMonth: number
  revenueLastMonth: number
  totalSupporters: number
  newSupportersThisMonth: number
  ticketsSold: number
  totalOrders: number
  totalFeesCovered: number
  recentOrders: RecentOrder[]
  ticketRevenue: number
  ticketOrders: number
  donationRevenue: number
  donationOrders: number
}

export async function getDashboardStats(): Promise<{
  success: boolean
  data: DashboardStats | null
  error: string | null
}> {
  const auth = await requireAdmin()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // CANCELLED means the subscription stopped, not that it was refunded, so
    // the money it collected still counts toward revenue.
    const revenueStatuses = { status: { in: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED] } }

    // Tickets are the exception: a cancelled order isn't a seat filled.
    const confirmed = { status: OrderStatus.CONFIRMED }

    // Summed in Postgres rather than in JS, so this stays flat as orders grow
    const [allTime, thisMonth, lastMonth, totalSupporters, newSupportersThisMonth, ticketsSold, byType, recentOrders] =
      await Promise.all([
        prisma.order.aggregate({
          where: revenueStatuses,
          _sum: { totalAmount: true, feesCovered: true },
          _count: true
        }),

        prisma.order.aggregate({
          where: { ...revenueStatuses, createdAt: { gte: startOfMonth } },
          _sum: { totalAmount: true }
        }),

        prisma.order.aggregate({
          where: { ...revenueStatuses, createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
          _sum: { totalAmount: true }
        }),

        prisma.user.count({
          where: { role: 'SUPPORTER' }
        }),

        prisma.user.count({
          where: { role: 'SUPPORTER', createdAt: { gte: startOfMonth } }
        }),

        prisma.orderItem.aggregate({
          where: { order: { ...confirmed, type: 'TICKET_PURCHASE' } },
          _sum: { quantity: true }
        }),

        prisma.order.groupBy({
          by: ['type'],
          where: revenueStatuses,
          _sum: { totalAmount: true },
          _count: true
        }),

        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            createdAt: true,
            type: true,
            status: true,
            totalAmount: true,
            customerName: true,
            user: { select: { firstName: true, lastName: true, email: true } },
            event: { select: { title: true } }
          }
        })
      ])

    const sumFor = (types: string[]) =>
      byType.filter((row) => types.includes(row.type)).reduce((sum, row) => sum + Number(row._sum.totalAmount ?? 0), 0)

    const countFor = (types: string[]) =>
      byType.filter((row) => types.includes(row.type)).reduce((sum, row) => sum + row._count, 0)

    const DONATION_TYPES = ['ONE_TIME_DONATION', 'RECURRING_DONATION']
    const TICKET_TYPES = ['TICKET_PURCHASE']

    return {
      success: true,
      error: null,
      data: {
        totalRevenue: Number(allTime._sum.totalAmount ?? 0),
        revenueThisMonth: Number(thisMonth._sum.totalAmount ?? 0),
        revenueLastMonth: Number(lastMonth._sum.totalAmount ?? 0),
        totalFeesCovered: Number(allTime._sum.feesCovered ?? 0),
        totalOrders: allTime._count,
        totalSupporters,
        newSupportersThisMonth,
        ticketsSold: ticketsSold._sum.quantity ?? 0,
        recentOrders: recentOrders.map((order) => ({
          ...order,
          totalAmount: Number(order.totalAmount)
        })),
        ticketRevenue: sumFor(TICKET_TYPES),
        ticketOrders: countFor(TICKET_TYPES),
        donationRevenue: sumFor(DONATION_TYPES),
        donationOrders: countFor(DONATION_TYPES)
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch dashboard stats', {
      userId: auth.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load dashboard stats.' }
  }
}
