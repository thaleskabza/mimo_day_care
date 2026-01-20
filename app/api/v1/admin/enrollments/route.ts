import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";
import { createEnrollmentSchema } from "@/lib/validations/enrollment";

/**
 * POST /api/v1/admin/enrollments
 * Create new enrollment (from approved application)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = createEnrollmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { applicationId, classId, startDate, endDate } = validation.data;

    // Verify application exists and is approved
    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: {
        child: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Can only create enrollment for approved applications" },
        { status: 400 }
      );
    }

    // Verify class exists
    const classEntity = await db.class.findUnique({
      where: { id: classId },
    });

    if (!classEntity) {
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
    }

    // Check for existing active enrollment for this child
    const existingEnrollment = await db.enrollment.findFirst({
      where: {
        childId: application.childId,
        status: "ACTIVE",
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Child already has an active enrollment" },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        childId: application.childId,
        classId,
        status: "PENDING",
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        child: true,
        class: {
          include: {
            program: true,
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/v1/admin/enrollments
 * Get all enrollments with filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const classId = searchParams.get("classId");

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (classId) {
      where.classId = classId;
    }

    const enrollments = await db.enrollment.findMany({
      where,
      include: {
        child: {
          include: {
            parent: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        class: {
          include: {
            program: true,
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
