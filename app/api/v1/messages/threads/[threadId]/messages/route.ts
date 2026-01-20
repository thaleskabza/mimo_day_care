import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";
import { createMessageSchema } from "@/lib/validations/message";

/**
 * POST /api/v1/messages/threads/[threadId]/messages
 * Send a message in a thread
 */
export async function POST(
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

    // Only parents and teachers can send messages (not admins - read-only audit)
    if (!userRoles.some((r: any) => r.role === "PARENT" || r.role === "TEACHER")) {
      return NextResponse.json(
        { error: "Only parents and teachers can send messages" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = createMessageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { content } = validation.data;

    // Get thread
    const thread = await db.messageThread.findUnique({
      where: { id: threadId },
      include: {
        child: {
          include: {
            enrollments: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
        class: true,
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Authorization check
    let hasAccess = false;

    if (userRoles.some((r: any) => r.role === "PARENT")) {
      // Parent can send if they own the child and child has active enrollment
      const parentProfile = await db.parentProfile.findUnique({
        where: { userId },
      });
      const hasActiveEnrollment = thread.child.enrollments.length > 0;
      hasAccess = parentProfile?.userId === thread.child.parentUserId && hasActiveEnrollment;

      if (!hasActiveEnrollment) {
        return NextResponse.json(
          { error: "Cannot send messages - child enrollment is not active" },
          { status: 403 }
        );
      }
    } else if (userRoles.some((r: any) => r.role === "TEACHER")) {
      // Teacher can send if assigned to the class
      hasAccess = userId === thread.class.teacherUserId;
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Create message
    const message = await db.message.create({
      data: {
        threadId,
        senderUserId: userId,
        body: content,
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Update thread's updatedAt timestamp
    await db.messageThread.update({
      where: { id: threadId },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
