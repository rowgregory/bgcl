'use server'

import prisma from '@/prisma/client'
import { ActionResult } from '@/types/common'
import { CreatePartnerInputs } from '@/types/entities/partner'
import { revalidatePath } from 'next/cache'
import { sanitizePartnerData } from '../../utils/sanitizePartnerData'
import { createLog } from '../log/createLog'

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
