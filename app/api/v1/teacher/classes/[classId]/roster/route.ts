import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/auth/guards";

/**
 * GET /api/v1/teacher/classes/[classId]/roster
 * Get roster (enrolled children) for a specific class
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !isTeacher(session.user as any)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { classId } = await params;

    // Verify teacher is assigned to this class
    const classEntity = await db.class.findFirst({
      where: {
        id: classId,
        teacherUserId: userId,
      },
    });

    if (!classEntity) {
      return NextResponse.json(
        { error: "Class not found or access denied" },
        { status: 404 }
      );
    }

    // Get active enrollments for this class
    const enrollments = await db.enrollment.findMany({
      where: {
        classId,
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
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        child: {
          name: "asc",
        },
      },
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error("Error fetching class roster:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
