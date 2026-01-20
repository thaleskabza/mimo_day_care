import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";
import { z } from "zod";
import { createAuditLog } from "@/lib/audit";
import { Role } from "@/generated/prisma";

const assignRoleSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  role: z.nativeEnum(Role),
});

/**
 * POST /api/v1/admin/staff/assign-role
 * Assign role to user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUserId = (session.user as any).id;
    const body = await request.json();

    // Validate input
    const validation = assignRoleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { userId, role } = validation.data;

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user already has this role
    const hasRole = user.roles.some((r) => r.role === role);
    if (hasRole) {
      return NextResponse.json(
        { error: "User already has this role" },
        { status: 400 }
      );
    }

    // Assign role
    const userRole = await db.userRole.create({
      data: {
        userId,
        role,
      },
    });

    // Create audit log
    await createAuditLog({
      action: "ROLE_ASSIGNED",
      entityType: "USER",
      entityId: userId,
      userId: adminUserId,
      metadata: {
        role,
      },
    });

    return NextResponse.json({ userRole }, { status: 201 });
  } catch (error) {
    console.error("Error assigning role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
