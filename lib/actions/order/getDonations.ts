'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { BillingAddress } from '@/app/(authenticated)/admin/donations/_types/donation.types'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function getDonations() {
  const auth = await requireAdmin()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    const donations = await prisma.order.findMany({
      where: {
        type: {
          in: ['ONE_TIME_DONATION', 'RECURRING_DONATION']
        }
      },
      include: { campaign: true },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const serializedDonations = donations.map((donation) => ({
      ...donation,
      totalAmount: Number(donation.totalAmount),
      feesCovered: Number(donation.feesCovered),
      billingAddress: (donation.billingAddress as BillingAddress | null) ?? null
    }))

    return { success: true, data: serializedDonations, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch donations', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load donations' }
  }
}
