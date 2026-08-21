'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { Partner } from '@prisma/client'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function reorderPartners(tier: string, partners: Partner[]) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    // Validation
    if (!partners || !Array.isArray(partners) || partners.length === 0) {
      return { success: false, data: null, error: 'Invalid partners data' }
    }

    if (!tier || typeof tier !== 'string') {
      return { success: false, data: null, error: 'Invalid tier' }
    }

    const isValidPartners = partners.every((member) => member.id && member.tier === tier)

    if (!isValidPartners) {
      return {
        success: false,
        data: null,
        error: `Invalid partner data structure - missing id or tier doesn't match ${tier}`
      }
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
      },
      error: null
    }
  } catch (error) {
    await createLog('error', 'Failed to reorder partners', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      data: null,
      error: 'Failed to reorder partners. Please try again.'
    }
  }
}

async function updateOrderInDatabase(partners: Partner[]) {
  const updatePromises = partners.map((partner, index) =>
    prisma.partner.update({
      where: { id: partner.id },
      data: { order: index + 1 }
    })
  )
  return Promise.all(updatePromises)
}
