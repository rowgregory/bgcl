'use server'

import prisma from '@/prisma/client'
import { ActionResult } from '@/types/common'
import { PartnerFormData } from '@/types/entities/partner'
import { sanitizePartnerData } from '../utils/sanitizePartnerData'
import { createLog } from './createLog'

export async function updatePartner(id: string, data: PartnerFormData): Promise<ActionResult> {
  try {
    if (!id) return { success: false, error: 'Partner ID is required.' }

    const existing = await prisma.partner.findUnique({ where: { id } })
    if (!existing) return { success: false, error: 'Partner not found.' }

    const sanitized = sanitizePartnerData(data)

    await prisma.partner.update({ where: { id }, data: sanitized })

    return { success: true, id }
  } catch (err) {
    createLog('error', 'updatePartner', err)
    return { success: false, error: 'Failed to update partner. Please try again.' }
  }
}
