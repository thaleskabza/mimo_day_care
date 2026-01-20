import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";
import { updateApplicationStatusSchema } from "@/lib/validations/application";
import { isValidApplicationTransition } from "@/lib/validators/state-transitions";
import { createAuditLog } from "@/lib/audit";

/**
 * POST /api/v1/admin/applications/[id]/status
 * Update application status (with state transition validation)
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
    const body = await request.json();

    // Validate input
    const validation = updateApplicationStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { status, adminNotes } = validation.data;

    // Get current application
    const application = await db.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Validate state transition
    if (!isValidApplicationTransition(application.status, status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${application.status} to ${status}` },
        { status: 400 }
      );
    }

    // Update application status
    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        status,
        adminNotes,
      },
      include: {
        child: true,
        program: true,
      },
    });

    // Create audit log
    await createAuditLog({
      action: "APPLICATION_STATUS_CHANGED",
      entityType: "APPLICATION",
      entityId: id,
      userId,
      metadata: {
        oldStatus: application.status,
        newStatus: status,
        adminNotes,
      },
    });

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
