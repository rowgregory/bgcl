import prisma from '@/prisma/client'
import { requireSuperuser } from '@/lib/utils/requireAdmin'
import { createLog } from '../log/createLog'

export async function getSuperDashboardData() {
  const auth = await requireSuperuser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
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
          orders: (order: any) => ({
            ...order,
            totalAmount: Number(order.totalAmount),
            feesCovered: order.feesCovered != null ? Number(order.feesCovered) : null,
            createdAt: order.createdAt.toISOString()
          })
        })),
        logs: logs.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString()
        }))
      },
      error: null
    }
  } catch (error) {
    await createLog('error', 'Error fetching super dashboard data', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      data: null,
      error: 'Could not load super dashboard data.'
    }
  }
}
