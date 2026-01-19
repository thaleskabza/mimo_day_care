import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { isParent } from "@/lib/auth/guards";

/**
 * GET /api/v1/parent/applications/[id]
 * Get a specific application's details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !isParent(session.user as any)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = params;

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

    // Get application with authorization check
    const application = await db.application.findFirst({
      where: {
        id,
        childId: {
          in: childIds,
        },
      },
      include: {
        child: true,
        program: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
