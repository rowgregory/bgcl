import prisma from '@/prisma/client'

export const getEvents = async () => {
  try {
    const events = await prisma.event.findMany({
      where: {
        isPublic: true
      },
      include: {
        tickets: true
      }
    })

    return events
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to fetch events',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    })

    return null
  }
}
