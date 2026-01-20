import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";
import { z } from "zod";

const createProgramSchema = z.object({
  name: z.string().min(2, "Program name must be at least 2 characters"),
  description: z.string().optional(),
  ageMinMonths: z.number().int().min(0, "Minimum age must be non-negative"),
  ageMaxMonths: z.number().int().positive("Maximum age must be positive"),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/v1/admin/programs
 * Get all programs
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const programs = await db.program.findMany({
      include: {
        _count: {
          select: {
            classes: true,
            applications: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/v1/admin/programs
 * Create new program
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = createProgramSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, description, ageMinMonths, ageMaxMonths, isActive } = validation.data;

    // Create program
    const program = await db.program.create({
      data: {
        name,
        description,
        ageMinMonths,
        ageMaxMonths,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ program }, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
