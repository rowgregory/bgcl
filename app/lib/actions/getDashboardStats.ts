'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export interface DashboardStats {
  totalRevenue: number
  revenueThisMonth: number
  revenueLastMonth: number
  totalSupporters: number
  newSupportersThisMonth: number
  ticketsSold: number
  totalOrders: number
  totalFeesCovered: number
  recentOrders: any
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    const [
      confirmedOrders,
      ordersThisMonth,
      ordersLastMonth,
      totalSupporters,
      newSupportersThisMonth,
      ticketsSold,
      totalOrders,
      recentOrders
    ] = await Promise.all([
      prisma.order.findMany({
        where: { status: 'CONFIRMED' },
        select: { totalAmount: true, feesCovered: true }
      }),

      prisma.order.findMany({
        where: { status: 'CONFIRMED', createdAt: { gte: startOfMonth } },
        select: { totalAmount: true }
      }),

      prisma.order.findMany({
        where: { status: 'CONFIRMED', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        select: { totalAmount: true }
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

      prisma.order.count({
        where: { status: 'CONFIRMED' }
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

    const normalizeFees = (raw: any) => {
      const n = Number(raw ?? 0)
      return Number.isInteger(n) ? n / 100 : n
    }

    return {
      totalRevenue: confirmedOrders.reduce((s, o) => s + Number(o.totalAmount), 0),
      revenueThisMonth: ordersThisMonth.reduce((s, o) => s + Number(o.totalAmount), 0),
      revenueLastMonth: ordersLastMonth.reduce((s, o) => s + Number(o.totalAmount), 0),
      totalSupporters,
      newSupportersThisMonth,
      ticketsSold: ticketsSold._sum.quantity ?? 0,
      totalOrders,
      totalFeesCovered: confirmedOrders.reduce((s, o) => s + normalizeFees(o.feesCovered), 0),
      recentOrders
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch dashboard stats', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
