'use server'

import { UpdateAddressInput } from '@/types/entities/address.types'
import { auth } from '../auth'
import { createLog } from './createLog'
import prisma from '@/prisma/client'

export const updateAddress = async (data: UpdateAddressInput) => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    await prisma.address.upsert({
      where: { userId: session.user.id },
      update: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        zipPostalCode: data.zipPostalCode,
        country: data.country
      },
      create: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        zipPostalCode: data.zipPostalCode,
        country: data.country,
        userId: session.user.id
      }
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update address', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to update address. Please try again.' }
  }
}
