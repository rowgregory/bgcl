import { requireAdmin } from '@/lib/utils/requireAdmin'
import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

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

export async function getDonationStats(): Promise<{ success: boolean; data: DonationStats | null; error: string }> {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const orders = (
      await prisma.order.findMany({
        where: {
          type: { in: ['ONE_TIME_DONATION', 'RECURRING_DONATION'] }
        },
        select: {
          totalAmount: true,
          type: true,
          recurringFrequency: true,
          status: true,
          createdAt: true,
          customerEmail: true,
          customerName: true,
          paidAt: true,
          notes: true,
          id: true,
          feesCovered: true,
          billingAddress: true,
          paymentIntentId: true,
          paymentMethodId: true,
          paymentMethod: true,
          campaign: true,
          stripeSubscriptionId: true
        }
      })
    ).map((o) => ({
      ...o,
      totalAmount: Number(o.totalAmount),
      feesCovered: Number(o.feesCovered)
    }))
    type SubSummary = { frequency: string | null; amount: number; status: string; lastPaidAt: Date | null }

    const subscriptionMap = new Map<string, SubSummary>()

    for (const order of orders) {
      if (order.type !== 'RECURRING_DONATION' || !order.stripeSubscriptionId) continue

      const seen = subscriptionMap.get(order.stripeSubscriptionId)
      const orderDate = order.paidAt ?? order.createdAt

      // Keep the most recent cycle: its amount and status are the current ones
      if (!seen || (orderDate && seen.lastPaidAt && new Date(orderDate) > new Date(seen.lastPaidAt))) {
        subscriptionMap.set(order.stripeSubscriptionId, {
          frequency: order.recurringFrequency,
          amount: order.totalAmount,
          status: order.status,
          lastPaidAt: orderDate
        })
      }
    }

    const subscriptions = Array.from(subscriptionMap.values())
    const activeSubs = subscriptions.filter((s) => s.status === 'CONFIRMED')

    const monthlySubs = activeSubs.filter((s) => s.frequency === 'monthly')
    const yearlySubs = activeSubs.filter((s) => s.frequency === 'yearly')

    const stats = {
      total: orders.length,
      oneTime: orders.filter((o) => o.type === 'ONE_TIME_DONATION' && o.status === 'CONFIRMED').length,

      monthly: monthlySubs.length,
      yearly: yearlySubs.length,

      totalRaised: orders.filter((o) => o.paymentMethodId !== null).reduce((sum, o) => sum + o.totalAmount, 0),

      monthlyRecurring: monthlySubs.reduce((sum, s) => sum + s.amount, 0),
      yearlyRecurring: yearlySubs.reduce((sum, s) => sum + s.amount, 0),

      activeCount: orders.filter((o) => o.status === 'CONFIRMED').length,
      failedCount: orders.filter((o) => o.status === 'FAILED').length,
      cancelledCount: orders.filter((o) => o.status === 'CANCELLED').length,

      churnRate:
        subscriptions.length > 0
          ? Math.round((subscriptions.filter((s) => s.status === 'CANCELLED').length / subscriptions.length) * 100)
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

      // Skip orders without a campaign name
      if (!campaignName) return

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
      success: true,
      data: {
        ...stats,
        failedOrders: orders?.filter((order) => order.status === 'FAILED'),
        annualArr,
        trendData,
        retentionData,
        campaigns,
        oneTimeTotal: orders
          .filter((item) => item.type === 'ONE_TIME_DONATION' && item.status === 'CONFIRMED')
          .reduce((acc, item) => acc + item.totalAmount, 0)
      } as DonationStats & { annualArr: number },
      error: null
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch donation stats', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, data: null, error: 'Could not load donation stats' }
  }
}
