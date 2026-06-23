'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { ActionResult } from '@/types/common'
import { sanitizePartnerData } from '../utils/sanitizePartnerData'
import { CreatePartnerInputs } from '@/types/entities/partner'
import { revalidatePath } from 'next/cache'

export async function createPartner(data: CreatePartnerInputs): Promise<ActionResult> {
  try {
    const sanitized = sanitizePartnerData(data)

    await prisma.partner.create({ data: sanitized })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (err) {
    createLog('error', 'createPartner', err)
    return { success: false, error: 'Failed to create partner. Please try again.' }
  }
}
