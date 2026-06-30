'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export interface DashboardStats {
  totalRevenue: number
  revenueThisMonth: number
  revenueLastMonth: number
  totalSupporters: number
  newSupportersThisMonth: number
  ticketsSold: number
  totalOrders: number
  totalFeesCovered: number
  recentOrders: any[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    // 5 queries instead of 8 — confirmed orders fetched once, filtered in JS
    const [confirmedOrders, totalSupporters, newSupportersThisMonth, ticketsSold, recentOrders] = await Promise.all([
      prisma.order.findMany({
        where: { status: 'CONFIRMED' },
        select: { totalAmount: true, feesCovered: true, createdAt: true }
      }),

      prisma.user.count({
        where: { role: 'SUPPORTER' }
      }),

      prisma.user.count({
        where: { role: 'SUPPORTER', createdAt: { gte: startOfMonth } }
      }),

      prisma.orderItem.aggregate({
        where: { order: { status: 'CONFIRMED', type: 'TICKET_PURCHASE' } },
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

    const thisMonthOrders = confirmedOrders.filter((o) => new Date(o.createdAt) >= startOfMonth)
    const lastMonthOrders = confirmedOrders.filter((o) => {
      const d = new Date(o.createdAt)
      return d >= startOfLastMonth && d <= endOfLastMonth
    })

    return {
      totalRevenue: confirmedOrders.reduce((s, o) => s + Number(o.totalAmount), 0),
      revenueThisMonth: thisMonthOrders.reduce((s, o) => s + Number(o.totalAmount), 0),
      revenueLastMonth: lastMonthOrders.reduce((s, o) => s + Number(o.totalAmount), 0),
      totalSupporters,
      newSupportersThisMonth,
      ticketsSold: ticketsSold._sum.quantity ?? 0,
      totalOrders: confirmedOrders.length,
      totalFeesCovered: confirmedOrders.reduce((s, o) => s + Number(o.feesCovered), 0),
      recentOrders
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch dashboard stats', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
