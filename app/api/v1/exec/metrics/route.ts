import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";

/**
 * GET /api/v1/exec/metrics
 * Get aggregated metrics without child identifiers
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["EXECUTIVE", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get enrollment metrics
    const totalEnrollments = await db.enrollment.count();
    const activeEnrollments = await db.enrollment.count({
      where: { status: "ACTIVE" },
    });
    const pendingEnrollments = await db.enrollment.count({
      where: { status: "PENDING" },
    });
    const pausedEnrollments = await db.enrollment.count({
      where: { status: "PAUSED" },
    });
    const endedEnrollments = await db.enrollment.count({
      where: { status: "ENDED" },
    });

    // Get application metrics
    const totalApplications = await db.application.count();
    const submittedApplications = await db.application.count({
      where: { status: "SUBMITTED" },
    });
    const underReviewApplications = await db.application.count({
      where: { status: "UNDER_REVIEW" },
    });
    const approvedApplications = await db.application.count({
      where: { status: "APPROVED" },
    });
    const waitlistedApplications = await db.application.count({
      where: { status: "WAITLISTED" },
    });
    const rejectedApplications = await db.application.count({
      where: { status: "REJECTED" },
    });

    // Get program metrics
    const totalPrograms = await db.program.count();
    const programsWithCapacity = await db.program.findMany({
      select: {
        id: true,
        name: true,
        capacity: true,
        _count: {
          select: {
            classes: true,
            applications: true,
          },
        },
      },
    });

    // Get class metrics
    const totalClasses = await db.class.count();
    const classesWithEnrollments = await db.class.findMany({
      select: {
        id: true,
        name: true,
        capacity: true,
        program: {
          select: {
            name: true,
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
    });

    // Calculate class utilization
    const classUtilization = classesWithEnrollments.map((cls) => ({
      className: cls.name,
      programName: cls.program.name,
      capacity: cls.capacity,
      enrolled: cls._count.enrollments,
      utilizationPercent: Math.round((cls._count.enrollments / cls.capacity) * 100),
    }));

    // Get staff metrics
    const totalTeachers = await db.teacherProfile.count();
    const teachersWithClasses = await db.teacherProfile.findMany({
      select: {
        _count: {
          select: {
            classes: true,
          },
        },
      },
    });

    const averageClassesPerTeacher =
      teachersWithClasses.length > 0
        ? teachersWithClasses.reduce((sum, t) => sum + t._count.classes, 0) /
          teachersWithClasses.length
        : 0;

    // Get recent trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApplications = await db.application.count({
      where: {
        submittedAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const recentEnrollments = await db.enrollment.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get message activity (last 30 days)
    const recentMessages = await db.message.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const activeThreads = await db.messageThread.count({
      where: {
        updatedAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const metrics = {
      enrollments: {
        total: totalEnrollments,
        active: activeEnrollments,
        pending: pendingEnrollments,
        paused: pausedEnrollments,
        ended: endedEnrollments,
        activePercent: totalEnrollments > 0 ? Math.round((activeEnrollments / totalEnrollments) * 100) : 0,
      },
      applications: {
        total: totalApplications,
        submitted: submittedApplications,
        underReview: underReviewApplications,
        approved: approvedApplications,
        waitlisted: waitlistedApplications,
        rejected: rejectedApplications,
        approvalRate:
          totalApplications > 0
            ? Math.round((approvedApplications / totalApplications) * 100)
            : 0,
      },
      programs: {
        total: totalPrograms,
        breakdown: programsWithCapacity.map((program) => ({
          name: program.name,
          capacity: program.capacity,
          classCount: program._count.classes,
          applicationCount: program._count.applications,
        })),
      },
      classes: {
        total: totalClasses,
        utilization: classUtilization,
        averageUtilization:
          classUtilization.length > 0
            ? Math.round(
                classUtilization.reduce((sum, c) => sum + c.utilizationPercent, 0) /
                  classUtilization.length
              )
            : 0,
      },
      staff: {
        totalTeachers,
        averageClassesPerTeacher: Math.round(averageClassesPerTeacher * 10) / 10,
      },
      trends: {
        recentApplications30Days: recentApplications,
        recentEnrollments30Days: recentEnrollments,
        recentMessages30Days: recentMessages,
        activeThreads30Days: activeThreads,
      },
    };

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
