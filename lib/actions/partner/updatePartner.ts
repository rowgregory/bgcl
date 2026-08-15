'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { createLog } from '../log/createLog'
import { partnerSchema, PARTNER_NULLABLE_FIELDS } from '@/lib/validations/partner.validation'
import { emptyToNull } from '@/lib/utils/emptyToNull'

export async function updatePartner(id: string, input: unknown) {
  if (!id) {
    return { success: false, error: 'Partner ID is required.' }
  }

  const parsed = partnerSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid partner data'
    }
  }

  const data = parsed.data

  try {
    const existing = await prisma.partner.findUnique({
      where: { id },
      select: { id: true }
    })

    if (!existing) {
      return { success: false, error: 'Partner not found.' }
    }

    // `order` is managed by drag-to-reorder, so it isn't touched here
    const partner = await prisma.partner.update({
      where: { id },
      data: {
        ...emptyToNull(data, PARTNER_NULLABLE_FIELDS),
        category: data.category ?? null,
        tier: data.tier ?? null
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Partner updated', {
      partnerId: partner.id,
      name: partner.name
    })

    return { success: true, data: partner }
  } catch (error) {
    await createLog('error', 'Failed to update partner', {
      partnerId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to update partner. Please try again.' }
  }
}
