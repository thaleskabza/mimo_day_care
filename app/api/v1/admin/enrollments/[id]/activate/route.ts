import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";
import { isValidEnrollmentTransition } from "@/lib/validators/state-transitions";
import { createAuditLog } from "@/lib/audit";

/**
 * POST /api/v1/admin/enrollments/[id]/activate
 * Activate enrollment (PENDING -> ACTIVE)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = await params;

    // Get current enrollment
    const enrollment = await db.enrollment.findUnique({
      where: { id },
      include: {
        child: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Validate state transition
    if (!isValidEnrollmentTransition(enrollment.status, "ACTIVE")) {
      return NextResponse.json(
        { error: `Cannot activate enrollment in ${enrollment.status} status` },
        { status: 400 }
      );
    }

    // Check for other active enrollments for this child
    const existingActive = await db.enrollment.findFirst({
      where: {
        childId: enrollment.childId,
        status: "ACTIVE",
        id: {
          not: id,
        },
      },
    });

    if (existingActive) {
      return NextResponse.json(
        { error: "Child already has an active enrollment" },
        { status: 400 }
      );
    }

    // Activate enrollment
    const updatedEnrollment = await db.enrollment.update({
      where: { id },
      data: {
        status: "ACTIVE",
      },
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
    });

    // Create audit log
    await createAuditLog({
      action: "ENROLLMENT_ACTIVATED",
      entityType: "Enrollment",
      entityId: id,
      userId,
      metadata: {
        childId: enrollment.childId,
        classId: enrollment.classId,
      },
    });

    return NextResponse.json({ enrollment: updatedEnrollment });
  } catch (error) {
    console.error("Error activating enrollment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
