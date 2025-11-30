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

    // Check if hero exists
    const existingHero = await prisma.hero.findUnique({
      where: { id },
    });

    if (!existingHero) {
      await createLog("warn", "Hero not found for update", {
        heroId: id,
      });
      return NextResponse.json(
        { success: false, error: "Hero not found" },
        { status: 404 }
      );
    }

    // Remove status from update data if present (only allow via activate endpoint)
    delete body.status;

    const hero = await prisma.hero.update({
      where: { id },
      data: body,
    });

    await createLog("info", "Hero updated successfully", {
      heroId: hero.id,
      heroName: hero.name,
      updatedFields: Object.keys(body),
    });

    return NextResponse.json({ success: true, data: hero });
  } catch (error) {
    await createLog("error", "Failed to update hero", {
      error: error instanceof Error ? error.message : "Unknown error",
      heroId: id,
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update hero",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/hero/[id] - Delete hero
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const parameters = await params;
  const id = parameters.id;
  try {
    // Check if hero exists
    const existingHero = await prisma.hero.findUnique({
      where: { id },
    });

    if (!existingHero) {
      await createLog("warn", "Hero not found for deletion", {
        heroId: id,
      });
      return NextResponse.json(
        { success: false, error: "Hero not found" },
        { status: 404 }
      );
    }

    // Prevent deleting active hero (optional - remove if you want to allow it)
    if (existingHero.status === "ACTIVE") {
      await createLog("warn", "Cannot delete active hero", {
        heroId: id,
        heroName: existingHero.name,
      });
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot delete active hero. Please activate another hero first.",
        },
        { status: 400 }
      );
    }

    await prisma.hero.delete({
      where: { id },
    });

    await createLog("info", "Hero deleted successfully", {
      heroId: id,
      heroName: existingHero.name,
      heroStatus: existingHero.status,
    });

    return NextResponse.json({
      success: true,
      message: "Hero deleted successfully",
    });
  } catch (error) {
    await createLog("error", "Failed to delete hero", {
      error: error instanceof Error ? error.message : "Unknown error",
      heroId: id,
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete hero",
      },
      { status: 500 }
    );
  }
}
