import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/auth/guards";

/**
 * GET /api/v1/teacher/classes
 * Get classes assigned to the authenticated teacher
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !isTeacher(session.user as any)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get classes assigned to this teacher
    const classes = await db.class.findMany({
      where: {
        teacherUserId: userId,
      },
      include: {
        program: true,
        _count: {
          select: {
            enrollments: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
