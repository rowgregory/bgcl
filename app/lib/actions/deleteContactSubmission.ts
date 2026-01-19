'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function deleteContactSubmission(id: string) {
  try {
    await prisma.contactSubmission.delete({
      where: { id }
    })

    revalidateTag('Contact-Submission', 'default')

    return {
      success: true,
      message: 'Contact submission deleted successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to delete contact submission',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          contactSubmissionId: id
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete contact submission',
      message: 'Failed to delete contact submission'
    }
  }
}
