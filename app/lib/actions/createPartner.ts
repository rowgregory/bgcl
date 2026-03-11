'use server'

import prisma from '@/prisma/client'
import { PartnerFormData } from '@/types/entities/partner'
import { createLog } from './createLog'
import { ActionResult } from '@/types/common'
import { sanitizePartnerData } from '../utils/sanitizePartnerData'

export async function createPartner(data: PartnerFormData): Promise<ActionResult> {
  try {
    const sanitized = sanitizePartnerData(data)

    await prisma.partner.create({ data: sanitized })

    return { success: true }
  } catch (err) {
    createLog('error', 'createPartner', err)
    return { success: false, error: 'Failed to create partner. Please try again.' }
  }
}
