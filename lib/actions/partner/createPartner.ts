'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { createLog } from '../log/createLog'
import { partnerSchema, PARTNER_NULLABLE_FIELDS } from '@/lib/validations/partner.validation'
import { emptyToNull } from '@/lib/utils/emptyToNull'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function createPartner(input: unknown) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  const parsed = partnerSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      data: null,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid partner data'
    }
  }

  const data = parsed.data

  try {
    // Place new partners at the end of the list
    const lastPartner = await prisma.partner.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const partner = await prisma.partner.create({
      data: {
        ...emptyToNull(data, PARTNER_NULLABLE_FIELDS),
        category: data.category ?? null,
        tier: data.tier ?? null,
        order: (lastPartner?.order ?? -1) + 1
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Partner created', {
      partnerId: partner.id,
      name: partner.name
    })

    return { success: true, data: partner, error: null }
  } catch (error) {
    await createLog('error', 'Failed to create partner', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Failed to create partner. Please try again.' }
  }
}
