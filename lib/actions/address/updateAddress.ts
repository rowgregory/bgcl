'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { addressSchema } from '@/lib/validations/address.validation'
import { requireUser } from '@/lib/utils/requireAdmin'

export const updateAddress = async (input: unknown) => {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  const parsed = addressSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      data: null,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid address'
    }
  }

  const data = parsed.data

  const fields = {
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2 || null,
    city: data.city,
    state: data.state,
    zipPostalCode: data.zipPostalCode,
    country: data.country
  }

  try {
    const address = await prisma.address.upsert({
      where: { userId: auth.user.id },
      update: fields,
      create: { ...fields, userId: auth.user.id }
    })

    await createLog('info', 'Address updated', {
      userId: auth.user.id,
      addressId: address.id
    })

    return { success: true, data: address, error: null }
  } catch (error) {
    await createLog('error', 'Failed to update address', {
      userId: auth.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to update address. Please try again.' }
  }
}
