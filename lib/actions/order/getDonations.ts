'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { BillingAddress, DonationWithRelations } from '@/app/(authenticated)/admin/donations/_types/donation.types'

export const getDonations = async (): Promise<DonationWithRelations[]> => {
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

    return donations.map((donation) => ({
      ...donation,
      totalAmount: Number(donation.totalAmount),
      feesCovered: Number(donation.feesCovered),
      billingAddress: (donation.billingAddress as BillingAddress | null) ?? null
    }))
  } catch (error) {
    await createLog('error', 'Failed to fetch donations', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
