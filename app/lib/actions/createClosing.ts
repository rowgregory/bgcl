'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export interface CreateClosingInput {
  title: string
  date: string
  order: number
}

export async function createClosing(data: CreateClosingInput) {
  try {
    await prisma.closing.create({
      data: {
        title: data.title,
        date: data.date,
        order: data.order ?? 0
      }
    })

    revalidateTag('Closing', 'default')

    return {
      success: true,
      message: 'Closing created successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to create closing',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          input: data
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create closing',
      message: 'Failed to create closing'
    }
  }
}
