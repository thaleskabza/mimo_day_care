import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { isParent } from "@/lib/auth/guards";
import { isValidApplicationTransition } from "@/lib/validators/state-transitions";

/**
 * POST /api/v1/parent/applications/[id]/submit
 * Submit an application (DRAFT -> SUBMITTED)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !isParent(session.user as any)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = await params;

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
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or access denied" },
        { status: 404 }
      );
    }

    // Validate state transition
    if (!isValidApplicationTransition(application.status, "SUBMITTED")) {
      return NextResponse.json(
        { error: `Cannot submit application in ${application.status} status` },
        { status: 400 }
      );
    }

    // Update application status to SUBMITTED
    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: {
        child: true,
        program: true,
      },
    });

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
