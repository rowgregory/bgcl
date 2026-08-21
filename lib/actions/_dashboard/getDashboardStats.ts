'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

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
}

export async function getDashboardStats(): Promise<{
  success: boolean
  data: DashboardStats | null
  error: string | null
}> {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const confirmed = { status: 'CONFIRMED' as const }

    // Summed in Postgres rather than in JS, so this stays flat as orders grow
    const [allTime, thisMonth, lastMonth, totalSupporters, newSupportersThisMonth, ticketsSold, recentOrders] =
      await Promise.all([
        prisma.order.aggregate({
          where: confirmed,
          _sum: { totalAmount: true, feesCovered: true },
          _count: true
        }),

        prisma.order.aggregate({
          where: { ...confirmed, createdAt: { gte: startOfMonth } },
          _sum: { totalAmount: true }
        }),

        prisma.order.aggregate({
          where: { ...confirmed, createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
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
        }))
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
