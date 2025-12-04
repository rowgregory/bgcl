import { createLog } from '@/app/lib/actions/createLog'
import prisma from '@/prisma/client'
import { RouteParams } from '@/types/common'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params

  try {
    const body = await req.json()

    const existingEvent = await prisma.event.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      await createLog('warn', 'Event not found for update', {
        eventId: id
      })
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 })
    }

    // Remove status from update data if present (only allow via activate endpoint)
    delete body.status
    delete body.attendees
    delete body.isUpdating

    console.log('BODY: ', body)

    const { date, registrationDeadline, salesStartDate, salesEndDate, ...restBody } = body

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...restBody,
        // Now these won't be overwritten
        date: new Date(date),
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        salesStartDate: salesStartDate ? new Date(salesStartDate) : null,
        salesEndDate: salesEndDate ? new Date(salesEndDate) : null
      }
    })

    await createLog('info', 'Event updated successfully', {
      eventId: event.id,
      eventTitle: event.title,
      updatedFields: Object.keys(body)
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    await createLog('error', 'Failed to update event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      eventId: id
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update event'
      },
      { status: 500 }
    )
  }
}
