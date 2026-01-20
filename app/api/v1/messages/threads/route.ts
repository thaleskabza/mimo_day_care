import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";
import { createThreadSchema } from "@/lib/validations/message";

/**
 * GET /api/v1/messages/threads
 * Get all message threads for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRoles = (session.user as any).roles || [];

    let threads: any = [];

    // Check user role and fetch appropriate threads
    if (userRoles.some((r: any) => r.role === "PARENT")) {
      // Get parent's threads
      const parentProfile = await db.parentProfile.findUnique({
        where: { userId },
        include: {
          children: {
            include: {
              messageThreads: {
                include: {
                  class: {
                    include: {
                      teacher: {
                        include: {
                          user: {
                            select: {
                              name: true,
                            },
                          },
                        },
                      },
                      program: true,
                    },
                  },
                  child: true,
                  messages: {
                    orderBy: {
                      createdAt: "desc",
                    },
                    take: 1,
                  },
                  _count: {
                    select: {
                      messages: true,
                    },
                  },
                },
                orderBy: {
                  updatedAt: "desc",
                },
              },
            },
          },
        },
      });

      if (parentProfile) {
        threads = parentProfile.children.flatMap((child) => child.messageThreads);
      }
    } else if (userRoles.some((r: any) => r.role === "TEACHER")) {
      // Get teacher's threads
      const teacherProfile = await db.teacherProfile.findUnique({
        where: { userId },
        include: {
          classes: {
            include: {
              messageThreads: {
                include: {
                  child: {
                    include: {
                      parent: {
                        include: {
                          user: {
                            select: {
                              name: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  class: {
                    include: {
                      program: true,
                    },
                  },
                  messages: {
                    orderBy: {
                      createdAt: "desc",
                    },
                    take: 1,
                  },
                  _count: {
                    select: {
                      messages: true,
                    },
                  },
                },
                orderBy: {
                  updatedAt: "desc",
                },
              },
            },
          },
        },
      });

      if (teacherProfile) {
        threads = teacherProfile.classes.flatMap((cls) => cls.messageThreads);
      }
    } else if (hasAnyRole(session.user as any, ["ADMIN", "PRINCIPAL"])) {
      // Admins can see all threads (read-only audit access)
      threads = await db.messageThread.findMany({
        include: {
          child: {
            include: {
              parent: {
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          class: {
            include: {
              teacher: {
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              program: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }

    return NextResponse.json({ threads });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/v1/messages/threads
 * Create a new message thread (parent only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRoles = (session.user as any).roles || [];

    // Only parents can create threads
    if (!userRoles.some((r: any) => r.role === "PARENT")) {
      return NextResponse.json(
        { error: "Only parents can create message threads" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = createThreadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { childId, classId } = validation.data;

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

    // Verify parent owns the child
    const child = parentProfile.children.find((c) => c.id === childId);
    if (!child) {
      return NextResponse.json(
        { error: "Child not found or access denied" },
        { status: 404 }
      );
    }

    // Verify child has an active enrollment in this class
    const enrollment = await db.enrollment.findFirst({
      where: {
        childId,
        classId,
        status: "ACTIVE",
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Child must have an active enrollment in this class" },
        { status: 400 }
      );
    }

    // Get class to find teacher
    const classEntity = await db.class.findUnique({
      where: { id: classId },
    });

    if (!classEntity) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    if (!classEntity.teacherUserId) {
      return NextResponse.json(
        { error: "Class does not have an assigned teacher" },
        { status: 400 }
      );
    }

    // Check if thread already exists
    const existingThread = await db.messageThread.findFirst({
      where: {
        childId,
        classId,
      },
    });

    if (existingThread) {
      return NextResponse.json(
        { error: "Thread already exists for this child and class" },
        { status: 400 }
      );
    }

    // Create thread
    const thread = await db.messageThread.create({
      data: {
        childId,
        classId,
        parentUserId: parentProfile.userId,
        teacherUserId: classEntity.teacherUserId,
      },
      include: {
        child: true,
        class: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            program: true,
          },
        },
      },
    });

    return NextResponse.json({ thread }, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
