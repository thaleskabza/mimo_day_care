import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";
import { z } from "zod";

const createClassSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  programId: z.string().cuid("Invalid program ID"),
  teacherId: z.string().cuid("Invalid teacher ID"),
  capacity: z.number().int().positive("Capacity must be a positive number"),
});

/**
 * GET /api/v1/admin/classes
 * Get all classes
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const programId = searchParams.get("programId");

    const where: any = {};
    if (programId) {
      where.programId = programId;
    }

    const classes = await db.class.findMany({
      where,
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
        _count: {
          select: {
            enrollments: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/v1/admin/classes
 * Create new class
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = createClassSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, programId, teacherId, capacity } = validation.data;

    // Verify program exists
    const program = await db.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 }
      );
    }

    // Verify teacher exists and has TEACHER role
    const teacher = await db.teacherProfile.findUnique({
      where: { id: teacherId },
      include: {
        user: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    const hasTeacherRole = teacher.user.roles.some((r) => r.role === "TEACHER");
    if (!hasTeacherRole) {
      return NextResponse.json(
        { error: "User does not have TEACHER role" },
        { status: 400 }
      );
    }

    // Create class
    const classEntity = await db.class.create({
      data: {
        name,
        programId,
        teacherUserId: teacherId,
        capacity,
      },
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
    });

    return NextResponse.json({ class: classEntity }, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
