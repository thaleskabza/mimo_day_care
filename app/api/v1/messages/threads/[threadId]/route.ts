import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";

/**
 * GET /api/v1/messages/threads/[threadId]
 * Get a specific thread with all messages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRoles = (session.user as any).roles || [];
    const { threadId } = await params;

    // Get thread
    const thread = await db.messageThread.findUnique({
      where: { id: threadId },
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
            program: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Authorization check
    let hasAccess = false;

    if (userRoles.some((r: any) => r.role === "PARENT")) {
      // Parent can access if they own the child
      const parentProfile = await db.parentProfile.findUnique({
        where: { userId },
      });
      hasAccess = parentProfile?.userId === thread.child.parentUserId;
    } else if (userRoles.some((r: any) => r.role === "TEACHER")) {
      // Teacher can access if assigned to the class
      const teacherProfile = await db.teacherProfile.findUnique({
        where: { userId },
      });
      hasAccess = teacherProfile?.id === thread.class.teacherId;
    } else if (hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      // Admin can access all threads (audit)
      hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
