'use server'

import { unstable_cache } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getProgramById = unstable_cache(
  async (id: string) => {
    try {
      const program = await prisma.program.findUnique({
        where: { id }
      })

      if (!program) {
        await createLog('warn', 'Program not found', {
          programId: id
        })
        return null
      }

      return { program }
    } catch (error) {
      await createLog('error', 'Failed to fetch program', {
        error: error instanceof Error ? error.message : 'Unknown error',
        programId: id
      })
      return null
    }
  },
  ['getProgramById'],
  { tags: ['Program'] }
)
