'use server'

import prisma from '@/prisma/client'
import { ActionResult } from '@/types/common'
import { sanitizePartnerData } from '../utils/sanitizePartnerData'
import { createLog } from './createLog'
import { UpdatePartnerInputs } from '@/types/entities/partner'

export async function updatePartner(data: UpdatePartnerInputs): Promise<ActionResult> {
  try {
    if (!data?.id) return { success: false, error: 'Partner ID is required.' }

    const existing = await prisma.partner.findUnique({ where: { id: data?.id } })
    if (!existing) return { success: false, error: 'Partner not found.' }

    const sanitized = sanitizePartnerData(data)

    await prisma.partner.update({ where: { id: data?.id }, data: sanitized })

    return { success: true }
  } catch (err) {
    createLog('error', 'updatePartner', err)
    return { success: false, error: 'Failed to update partner. Please try again.' }
  }
}
