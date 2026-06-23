'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { IPartner } from '@/types/entities/partner'
import { revalidatePath } from 'next/cache'

export async function reorderPartners(tier: string, partners: IPartner[]) {
  try {
    // Validation
    if (!partners || !Array.isArray(partners) || partners.length === 0) {
      throw new Error('Invalid partners data')
    }

    if (!tier || typeof tier !== 'string') {
      throw new Error('Invalid tier')
    }

    const isValidPartners = partners.every((member) => member.id && member.tier === tier)

    if (!isValidPartners) {
      throw new Error(`Invalid partner data structure - missing id or tier doesn't match ${tier}`)
    }

    // Recalculate display order for tier group starting from 1
    const updatedPartners = partners.map((member, index) => ({
      ...member,
      order: index + 1
    }))

    // Update database with recalculated orders
    const savedPartners = await updateOrderInDatabase(updatedPartners)

    revalidatePath('/', 'layout')

    return {
      success: true,
      data: {
        tier,
        count: updatedPartners.length,
        saved: savedPartners
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to reorder partners', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to reorder partners. Please try again.'
    }
  }
}

async function updateOrderInDatabase(partners: IPartner[]) {
  const updatePromises = partners.map((partner, index) =>
    prisma.partner.update({
      where: { id: partner.id },
      data: { order: index + 1 }
    })
  )
  return Promise.all(updatePromises)
}
