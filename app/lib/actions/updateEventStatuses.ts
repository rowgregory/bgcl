import prisma from '@/prisma/client'

// cron: runs every 15 minutes or hourly
export async function updateEventStatuses() {
  const now = new Date()

  // Flip UPCOMING → ONGOING when ticket sales start
  await prisma.event.updateMany({
    where: {
      status: 'UPCOMING',
      ticketSalesStartDate: { lte: now },
      date: { gte: now }
    },
    data: { status: 'ONGOING' }
  })

  // Flip ONGOING → COMPLETED when event date has passed
  await prisma.event.updateMany({
    where: {
      status: 'ONGOING',
      date: { lt: now }
    },
    data: { status: 'COMPLETED' }
  })
}
