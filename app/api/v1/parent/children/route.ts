import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { createChildSchema } from "@/lib/validations/child";
import { isParent } from "@/lib/auth/guards";

/**
 * GET /api/v1/parent/children
 * Get all children for the authenticated parent
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !isParent(session.user as any)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get parent profile
    const parentProfile = await db.parentProfile.findUnique({
      where: { userId },
    });

    if (!parentProfile) {
      return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });
    }

    // Get all children for this parent
    const children = await db.child.findMany({
      where: {
        parentUserId: parentProfile.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ children });
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/v1/parent/children
 * Create a new child profile
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !isParent(session.user as any)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    // Validate input
    const validationResult = createChildSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, dob, medicalNotes, allergies, pickupList } = validationResult.data;

    // Get parent profile
    const parentProfile = await db.parentProfile.findUnique({
      where: { userId },
    });

    if (!parentProfile) {
      return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });
    }

    // Create child
    const child = await db.child.create({
      data: {
        parentUserId: parentProfile.userId,
        name,
        dob: new Date(dob),
        medicalNotes,
        allergies,
        pickupListJson: pickupList ? JSON.stringify(pickupList) : null,
      },
    });

    return NextResponse.json({ child }, { status: 201 });
  } catch (error) {
    console.error("Error creating child:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
