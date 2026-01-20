import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { isParent } from "@/lib/auth/guards";

/**
 * GET /api/v1/parent/children/[childId]
 * Get a specific child's details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !isParent(session.user as any)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { childId } = await params;

    // Get parent profile
    const parentProfile = await db.parentProfile.findUnique({
      where: { userId },
    });

    if (!parentProfile) {
      return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });
    }

    // Get child with authorization check
    const child = await db.child.findFirst({
      where: {
        id: childId,
        parentUserId: parentProfile.userId,
      },
      include: {
        applications: {
          include: {
            program: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        enrollments: {
          include: {
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
          where: {
            status: "ACTIVE",
          },
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: "Child not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ child });
  } catch (error) {
    console.error("Error fetching child:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
