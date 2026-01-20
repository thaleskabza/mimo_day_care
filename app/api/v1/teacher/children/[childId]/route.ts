import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/auth/guards";

/**
 * GET /api/v1/teacher/children/[childId]
 * Get child details (only if child is enrolled in teacher's class)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !isTeacher(session.user as any)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { childId } = await params;

    // Get teacher profile
    const teacherProfile = await db.teacherProfile.findUnique({
      where: { userId },
      include: {
        classes: true,
      },
    });

    if (!teacherProfile) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }

    // Get teacher's class IDs
    const teacherClassIds = teacherProfile.classes.map((c) => c.id);

    // Verify child is enrolled in one of teacher's classes
    const enrollment = await db.enrollment.findFirst({
      where: {
        childId,
        classId: {
          in: teacherClassIds,
        },
        status: "ACTIVE",
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Child not found in your classes" },
        { status: 404 }
      );
    }

    // Get child details
    const child = await db.child.findUnique({
      where: { id: childId },
      include: {
        parent: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        enrollments: {
          where: {
            classId: {
              in: teacherClassIds,
            },
            status: "ACTIVE",
          },
          include: {
            class: {
              include: {
                program: true,
              },
            },
          },
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: "Child not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ child });
  } catch (error) {
    console.error("Error fetching child:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
