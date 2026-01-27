import prisma from '@/prisma/client'
import { IProgram } from '@/types/entities/program'
import { unstable_cache } from 'next/cache'

export const getPrograms = unstable_cache(
  async (): Promise<IProgram[]> => {
    try {
      const programs = await prisma.program.findMany({
        orderBy: { order: 'asc' }
      })

      // Cast descriptions from JsonValue to string[]
      return programs.map((program) => ({
        ...program,
        descriptions: Array.isArray(program.descriptions) ? program.descriptions : []
      })) as IProgram[]
    } catch (error) {
      prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch programs',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return []
    }
  },
  ['getPrograms'],
  { tags: ['Program'] }
)
