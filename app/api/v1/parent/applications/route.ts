import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { createApplicationSchema } from "@/lib/validations/application";
import { isParent } from "@/lib/auth/guards";

/**
 * GET /api/v1/parent/applications
 * Get all applications for the authenticated parent's children
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
      include: {
        children: true,
      },
    });

    if (!parentProfile) {
      return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });
    }

    const childIds = parentProfile.children.map((c) => c.id);

    // Get all applications for parent's children
    const applications = await db.application.findMany({
      where: {
        childId: {
          in: childIds,
        },
      },
      include: {
        child: true,
        program: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/v1/parent/applications
 * Create a new application
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
    const validationResult = createApplicationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { childId, programId } = validationResult.data;

    // Verify child belongs to this parent
    const child = await db.child.findFirst({
      where: {
        id: childId,
        parent: {
          userId,
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: "Child not found or access denied" },
        { status: 404 }
      );
    }

    // Verify program exists
    const program = await db.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Check for existing active application
    const existingApplication = await db.application.findFirst({
      where: {
        childId,
        programId,
        status: {
          in: ["DRAFT", "SUBMITTED", "UNDER_REVIEW"],
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "An active application already exists for this child and program" },
        { status: 409 }
      );
    }

    // Create application in DRAFT status
    const application = await db.application.create({
      data: {
        childId,
        programId,
        status: "DRAFT",
      },
      include: {
        child: true,
        program: true,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
