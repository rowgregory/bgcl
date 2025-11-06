// app/api/profile/route.ts
import { createLog } from "@/app/lib/api/createLog";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      await createLog("warn", "Unauthorized profile access attempt", {
        session,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        parent: {
          include: {
            addresses: true,
            children: true,
          },
        },
      },
    });

    if (!user || !user.parent) {
      await createLog("warn", "Parent profile not found", {
        userId: session.user.id,
      });
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await createLog("info", "Profile retrieved successfully", {
      userId: session.user.id,
      parentId: user.parent.id,
    });

    return NextResponse.json(user);
  } catch (error) {
    await createLog("error", "Failed to retrieve profile", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
