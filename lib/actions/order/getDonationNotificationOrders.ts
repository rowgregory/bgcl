import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export async function getDonationNotificationOrders() {
  try {
    const donationNotificationOrders = await prisma.order.findMany({
      select: {
        id: true,
        customerName: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      data: donationNotificationOrders.map((d) => ({
        ...d,
        createdAt: d.createdAt.toISOString()
      })),
      error: null
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch donation notification orders', {})
    return { success: false, data: null, error: 'Could not load donation notification orders' }
  }
}
