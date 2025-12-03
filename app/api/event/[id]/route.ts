import { createLog } from "@/app/lib/actions/createLog";
import prisma from "@/prisma/client";
import { RouteParams } from "@/types/common";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const parameters = await params;
  const id = parameters.id;
  try {
    const body = await req.json();

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      await createLog("warn", "Event not found for update", {
        eventId: id,
      });
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // Remove status from update data if present (only allow via activate endpoint)
    delete body.status;

    const event = await prisma.event.update({
      where: { id },
      data: body,
    });

    await createLog("info", "Event updated successfully", {
      eventId: event.id,
      eventTitle: event.title,
      updatedFields: Object.keys(body),
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    await createLog("error", "Failed to update event", {
      error: error instanceof Error ? error.message : "Unknown error",
      eventId: id,
    });

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update event",
      },
      { status: 500 }
    );
  }
}
