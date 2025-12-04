import { createLog } from '@/app/lib/actions/createLog'
import prisma from '@/prisma/client'
import { RouteParams } from '@/types/common'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/event/[id]/ticket - Create new event ticket
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const eventTicket = await prisma.ticket.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        totalQuantity: body.totalQuantity,
        quantitySold: body.quantitySold,
        quantityReserved: body.quantityReserved,
        minPerOrder: body.minPerOrder,
        maxPerOrder: body.maxPerOrder,
        isAvailable: body.isAvailable,
        salesStartDate: new Date(body.salesStartDate),
        salesEndDate: new Date(body.salesEndDate),
        sortOrder: body.sortOrder,
        requiresApproval: body.requiresApproval,
        eventId: body.eventId
      }
    })

    await createLog('info', 'Event ticket created successfully', {
      eventTicketId: eventTicket.id,
      evenTicketTitle: eventTicket.name
    })

    return NextResponse.json({ success: true, eventTicket }, { status: 201 })
  } catch (error) {
    await createLog('error', 'Failed to create event ticket', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create event ticket'
      },
      { status: 500 }
    )
  }
}

// PUT /api/event/[id]/ticket - Update existing event ticket
export async function PUT(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const parameters = await params
  const id = parameters.id
  try {
    const body = await req.json()

    const existingEventTicket = await prisma.ticket.findUnique({
      where: { id }
    })

    if (!existingEventTicket) {
      await createLog('warn', 'Event ticket not found for update', {
        eventId: id
      })
      return NextResponse.json({ success: false, error: 'Event ticket not found' }, { status: 404 })
    }

    const eventTicket = await prisma.ticket.update({
      where: { id },
      data: body
    })

    await createLog('info', 'Event ticket updated successfully', {
      eventTicketId: eventTicket.id,
      eventTicketName: eventTicket.name,
      updatedFields: Object.keys(body)
    })

    return NextResponse.json({ success: true, eventTicket })
  } catch (error) {
    await createLog('error', 'Failed to update event ticket', {
      error: error instanceof Error ? error.message : 'Unknown error',
      eventId: id
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update event ticket'
      },
      { status: 500 }
    )
  }
}
