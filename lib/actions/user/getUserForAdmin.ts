import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'
import { serialize } from '@/lib/utils/serializers.utils'

export async function getUserForAdmin(id: string) {
  const auth = await requireAdmin()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  if (!id) return { success: false, data: null, error: 'Missing user id' }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        address: true,
        orders: {
          include: {
            event: { select: { title: true } },
            orderItems: {
              include: { ticket: { select: { name: true } } }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) return { success: false, data: null, error: 'Could not find that user' }

    return { success: true, data: serialize(user), error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch user for admin', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: id
    })

    return { success: false, data: null, error: 'Could not load that user' }
  }
}
