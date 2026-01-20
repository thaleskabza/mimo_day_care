import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";

const createTeacherSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bio: z.string().optional(),
  certifications: z.string().optional(),
});

/**
 * POST /api/v1/admin/staff/teachers
 * Create new teacher account with teacher profile
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = createTeacherSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, name, phone, password, bio, certifications } = validation.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user, teacher profile, and assign TEACHER role in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          name,
          phone,
          password: hashedPassword,
          status: "ACTIVE",
        },
      });

      // Assign TEACHER role
      await tx.userRole.create({
        data: {
          userId: user.id,
          role: "TEACHER",
        },
      });

      // Create teacher profile
      const teacherProfile = await tx.teacherProfile.create({
        data: {
          userId: user.id,
          bio,
          certifications,
        },
      });

      return { user, teacherProfile };
    });

    return NextResponse.json(
      {
        teacher: {
          id: result.teacherProfile.id,
          userId: result.user.id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          bio: result.teacherProfile.bio,
          certifications: result.teacherProfile.certifications,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/v1/admin/staff/teachers
 * Get all teachers
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teachers = await db.teacherProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        classes: {
          include: {
            program: true,
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
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    return NextResponse.json({ teachers });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
