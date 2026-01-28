import prisma from '@/prisma/client'
import { IProgram } from '@/types/entities/program'

export async function getPrograms(isListed?: boolean): Promise<IProgram[]> {
  try {
    const programs = await prisma.program.findMany({
      where: isListed !== undefined ? { isListed } : undefined,
      orderBy: { order: 'asc' }
    })

    return programs.map((program) => ({
      ...program,
      descriptions: Array.isArray(program.descriptions) ? program.descriptions : []
    })) as IProgram[]
  } catch (error) {
    await prisma.log.create({
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
}
