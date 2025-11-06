import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get parent record
  const parent = await prisma.parent.findUnique({
    where: { userId: session.user.id },
  });

  if (!parent) {
    return NextResponse.json(
      { error: "Parent profile not found" },
      { status: 404 }
    );
  }

  const body = await req.json();
  const { firstName, lastName, dateOfBirth, email, ...rest } = body;

  try {
    const age = calculateAge(new Date(dateOfBirth));
    const requiresLogin = age >= 13;

    let userId: string | undefined;

    // If youth is 13+, they MUST have a User account
    if (requiresLogin) {
      if (!email) {
        return NextResponse.json(
          {
            error:
              "Email is required for youth 13 and older (needed for attendance)",
          },
          { status: 400 }
        );
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }

      // Create User account for youth 13+
      const user = await prisma.user.create({
        data: {
          email,
          role: "YOUTH",
          hasLoginAccess: true,
        },
      });

      userId = user.id;

      // TODO: Send welcome email with instructions to set up account
      // await sendWelcomeEmail(email, firstName);
    }

    // Create Youth profile
    const youth = await prisma.youth.create({
      data: {
        userId,
        parentId: parent.id,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        requiresOwnLogin: requiresLogin, // Track this in DB
        ...rest,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      youth,
      age,
      requiresLogin,
      message: requiresLogin
        ? "Account created. Youth will receive login instructions via email."
        : "Youth profile created. No login required for attendance.",
    });
  } catch (error) {
    console.error("Error creating youth:", error);
    return NextResponse.json(
      { error: "Failed to create youth profile" },
      { status: 500 }
    );
  }
}
