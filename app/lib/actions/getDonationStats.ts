'use server'

import prisma from '@/prisma/client'

export interface DonationStats {
  total: number
  oneTime: number
  monthly: number
  yearly: number
  totalRaised: number
  monthlyRecurring: number
  yearlyRecurring: number
  activeCount: number
  churnRate: number
  avgDonation: number
  annualArr: number
}

export async function getDonationStats() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        type: { in: ['ONE_TIME_DONATION', 'RECURRING_DONATION'] }
      },
      select: {
        totalAmount: true,
        type: true,
        recurringFrequency: true,
        status: true,
        createdAt: true,
        campaign: true
      }
    })

    const stats = {
      total: orders.length,
      oneTime: orders.filter((o) => o.type === 'ONE_TIME_DONATION').length,
      monthly: orders.filter((o) => o.type === 'RECURRING_DONATION' && o.recurringFrequency === 'monthly').length,
      yearly: orders.filter((o) => o.type === 'RECURRING_DONATION' && o.recurringFrequency === 'yearly').length,
      totalRaised: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      monthlyRecurring: orders
        .filter((o) => o.type === 'RECURRING_DONATION' && o.recurringFrequency === 'monthly')
        .reduce((sum, o) => sum + o.totalAmount, 0),
      yearlyRecurring: orders
        .filter((o) => o.type === 'RECURRING_DONATION' && o.recurringFrequency === 'yearly')
        .reduce((sum, o) => sum + o.totalAmount, 0),
      activeCount: orders.filter((o) => o.status === 'CONFIRMED').length,
      churnRate:
        orders.length > 0
          ? Math.round((orders.filter((o) => o.status === 'CANCELLED').length / orders.length) * 100)
          : 0,
      avgDonation: orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length) : 0
    }

    // Calculate Annual ARR
    const annualArr = stats.monthlyRecurring * 12 + stats.yearlyRecurring

    // Generate trend data (last 6 months)
    const trendData = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt)
        return orderDate >= monthStart && orderDate <= monthEnd
      })

      trendData.push({
        name: monthNames[date.getMonth()],
        donations: monthOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        donors: monthOrders.length
      })
    }

    // Generate retention data (last 6 months)
    const retentionData = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt)
        return orderDate >= monthStart && orderDate <= monthEnd
      })

      const activeInMonth = monthOrders.filter((o) => o.status === 'CONFIRMED').length
      const totalInMonth = monthOrders.length
      const retention = totalInMonth > 0 ? Math.round((activeInMonth / totalInMonth) * 100) : 0

      retentionData.push({
        month: monthNames[date.getMonth()],
        retention
      })
    }

    // Group and calculate stats
    const campaignMap = new Map<string | null, { total: number; count: number }>()

    orders.forEach((order) => {
      const campaignName = order.campaign?.name || null
      const existing = campaignMap.get(campaignName) || { total: 0, count: 0 }
      campaignMap.set(campaignName, {
        total: existing.total + order.totalAmount,
        count: existing.count + 1
      })
    })

    // Convert to array with stats
    const campaigns = Array.from(campaignMap.entries()).map(([name, data]) => ({
      campaignName: name,
      totalAmount: data.total,
      count: data.count,
      averageDonation: data.total / data.count
    }))

    // Sort by total amount descending
    campaigns.sort((a, b) => b.totalAmount - a.totalAmount)

    return {
      ...stats,
      annualArr,
      trendData,
      retentionData,
      campaigns
    } as DonationStats & { annualArr: number }
  } catch (error) {
    console.error('Error fetching donation stats:', error)
    return {
      success: false,
      error: 'Failed to fetch donation stats'
    }
  }
}
