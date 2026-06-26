import prisma from '@/prisma/client'
import { auth } from '../../auth'
import { serializeOrder } from '../../utils/serialize'

export async function getSuperDashboardData() {
  try {
    const session = await auth()
    if (session?.user?.role !== 'SUPERUSER') {
      return { success: false, data: null, error: 'Unauthorized' }
    }

    const [users, logs] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          lastLoginAt: true,
          stripeCustomerId: true,
          address: true,
          paymentMethods: {
            select: {
              id: true,
              cardBrand: true,
              cardExpMonth: true,
              cardExpYear: true,
              cardholderName: true,
              cardLast4: true,
              createdAt: true,
              isDefault: true
            }
          },
          orders: {
            select: { id: true, totalAmount: true, status: true, type: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
          },
          _count: { select: { orders: true } }
        }
      }),

      prisma.log.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          level: true,
          message: true,
          metadata: true,
          createdAt: true
        }
      })
    ])

    return {
      success: true,
      data: {
        users: users.map((u) => ({
          ...u,
          createdAt: u.createdAt.toISOString(),
          lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
          orders: u.orders.map(serializeOrder)
        })),
        logs: logs.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString()
        }))
      },
      error: null
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
