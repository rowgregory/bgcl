import { createLog } from '@/app/lib/actions/createLog'
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/event - Get all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, events })
  } catch (error) {
    await createLog('error', 'Failed to fetch events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch events'
      },
      { status: 500 }
    )
  }
}

// POST /api/event - Create new event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const dateTimeString = `${body.date}T${body.time}:00Z` // "2025-12-16T18:00:00Z"
    console.log('body.registrationDeadline: ', body.registrationDeadline)
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        type: body.type,
        dresscode: body.dresscode,
        date: new Date(dateTimeString), // Convert to Date object
        time: body.time, // Keep as string if you have a separate time field
        duration: body.duration,
        location: body.location,
        maxAttendees: Number(body.maxAttendees),
        status: body.status,
        featured: body.featured,
        host: body.host,
        requirements: body.requirements || '',
        materials: body.materials || '',
        registrationUrl: body.registrationUrl,
        meetingUrl: body.meetingUrl,
        isPublic: body.isPublic ?? true,
        requiresRSVP: body.requiresRSVP ?? true,
        registrationDeadline: new Date(body.registrationDeadline),
        allowMultipleTickets: body.allowMultipleTickets ?? true,
        salesStartDate: body.salesStartDate ? new Date(body.salesStartDate) : null,
        salesEndDate: body.salesEndDate ? new Date(body.salesEndDate) : null,
        capacity: body.capacity,
        attendeeCount: body.attendeeCount
      }
    })

    await createLog('info', 'Event created successfully', {
      eventId: event.id,
      eventTitle: event.title
    })

    return NextResponse.json({ success: true, event }, { status: 201 })
  } catch (error) {
    await createLog('error', 'Failed to create event', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create event'
      },
      { status: 500 }
    )
  }
}
