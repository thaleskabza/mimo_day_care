import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";

/**
 * GET /api/v1/admin/applications
 * Get all applications with filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const programId = searchParams.get("programId");

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (programId) {
      where.programId = programId;
    }

    const applications = await db.application.findMany({
      where,
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
        program: true,
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
