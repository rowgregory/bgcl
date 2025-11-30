import { createLog } from "@/app/lib/actions/createLog";
import prisma from "@/prisma/client";
import { RouteParams } from "@/types/common";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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
      await createLog("warn", "Hero not found for activation", {
        heroId: id,
      });
      return NextResponse.json(
        { success: false, error: "Hero not found" },
        { status: 404 }
      );
    }

    // Use transaction to ensure atomicity - only one hero is active
    const result = await prisma.$transaction(async (tx) => {
      // First, set all heroes to DRAFT
      await tx.hero.updateMany({
        where: { status: "ACTIVE" },
        data: { status: "DRAFT" },
      });

      // Then, activate the selected hero
      const activatedHero = await tx.hero.update({
        where: { id },
        data: { status: "ACTIVE" },
      });

      return activatedHero;
    });

    await createLog("info", "Hero activated successfully", {
      heroId: result.id,
      heroName: result.name,
      previousStatus: existingHero.status,
      newStatus: result.status,
    });

    // Revalidate the homepage and any other pages that use the active hero
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      data: result,
      message: `Hero "${result.name}" is now active`,
    });
  } catch (error) {
    await createLog("error", "Failed to activate hero", {
      error: error instanceof Error ? error.message : "Unknown error",
      heroId: id,
    });

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to activate hero",
      },
      { status: 500 }
    );
  }
}
