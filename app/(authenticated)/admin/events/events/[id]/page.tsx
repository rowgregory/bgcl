import { auth } from '@/app/lib/auth/auth'
import prisma from '@/prisma/client'
import { redirect } from 'next/navigation'
import { AdminEventDetailsClient } from './AdminEventDetailsClient'
import { SerializedEvent } from '@/types/entities/event'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventControlPanelPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const { id } = await params
  const isNew = id === 'new'

  const event = isNew
    ? null
    : await prisma.event.findUnique({
        where: { id },
        include: {
          tickets: { orderBy: { sortOrder: 'asc' } }
        }
      })

  if (!isNew && !event) redirect('/admin/events/overview')

  const serializedEvent = event
    ? {
        ...event,
        date: event.date.toISOString(),
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
        raffleDrawDate: event.raffleDrawDate?.toISOString() ?? null,
        registrationDeadline: event.registrationDeadline?.toISOString() ?? null,
        ticketSalesStartDate: event.ticketSalesStartDate?.toISOString() ?? null,
        ticketSalesEndDate: event.ticketSalesEndDate?.toISOString() ?? null,
        rafflePrizes: (event.rafflePrizes ?? []) as unknown as { place: string; amount: string }[],
        tickets: event.tickets.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
          price: Number(t.price),
          sponsorPerks: (t.sponsorPerks ?? []) as string[]
        }))
      }
    : null

  return <AdminEventDetailsClient event={serializedEvent as unknown as SerializedEvent} isNew={isNew} />
}
