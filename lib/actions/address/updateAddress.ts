'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth/auth'
import { createLog } from '../log/createLog'
import { addressSchema } from '@/lib/validations/address.validation'

export const updateAddress = async (input: unknown) => {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const parsed = addressSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
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
      where: { userId: session.user.id },
      update: fields,
      create: { ...fields, userId: session.user.id }
    })

    await createLog('info', 'Address updated', {
      userId: session.user.id,
      addressId: address.id
    })

    return { success: true, data: address }
  } catch (error) {
    await createLog('error', 'Failed to update address', {
      userId: session.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to update address. Please try again.' }
  }
}
