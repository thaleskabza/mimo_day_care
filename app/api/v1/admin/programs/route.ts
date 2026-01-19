import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";
import { z } from "zod";

const createProgramSchema = z.object({
  name: z.string().min(2, "Program name must be at least 2 characters"),
  description: z.string().optional(),
  ageRange: z.string(),
  capacity: z.number().int().positive("Capacity must be a positive number"),
  tuitionFee: z.number().positive("Tuition fee must be positive"),
  schedule: z.string().optional(),
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
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, description, ageRange, capacity, tuitionFee, schedule } = validation.data;

    // Create program
    const program = await db.program.create({
      data: {
        name,
        description,
        ageRange,
        capacity,
        tuitionFee,
        schedule,
      },
    });

    return NextResponse.json({ program }, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
