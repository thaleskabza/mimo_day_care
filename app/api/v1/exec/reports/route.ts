import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { hasAnyRole } from "@/lib/auth/guards";

/**
 * GET /api/v1/exec/reports
 * Get aggregated reports without child identifiers
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAnyRole(session.user as any, ["EXECUTIVE", "PRINCIPAL"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("type") || "overview";

    let reportData: any = {};

    switch (reportType) {
      case "overview":
        reportData = await generateOverviewReport();
        break;

      case "enrollment":
        reportData = await generateEnrollmentReport();
        break;

      case "application":
        reportData = await generateApplicationReport();
        break;

      case "capacity":
        reportData = await generateCapacityReport();
        break;

      case "financial":
        reportData = await generateFinancialReport();
        break;

      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    return NextResponse.json({ report: reportData });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function generateOverviewReport() {
  const totalEnrollments = await db.enrollment.count();
  const activeEnrollments = await db.enrollment.count({ where: { status: "ACTIVE" } });
  const totalApplications = await db.application.count();
  const totalPrograms = await db.program.count();
  const totalClasses = await db.class.count();
  const totalTeachers = await db.teacherProfile.count();

  return {
    type: "overview",
    generatedAt: new Date().toISOString(),
    summary: {
      enrollments: {
        total: totalEnrollments,
        active: activeEnrollments,
      },
      applications: {
        total: totalApplications,
      },
      programs: {
        total: totalPrograms,
      },
      classes: {
        total: totalClasses,
      },
      staff: {
        totalTeachers,
      },
    },
  };
}

async function generateEnrollmentReport() {
  const enrollmentsByStatus = await db.enrollment.groupBy({
    by: ["status"],
    _count: true,
  });

  const enrollmentsByProgram = await db.enrollment.findMany({
    select: {
      status: true,
      class: {
        select: {
          program: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Group by program
  const programBreakdown: Record<string, any> = {};
  enrollmentsByProgram.forEach((enrollment) => {
    const programName = enrollment.class.program.name;
    if (!programBreakdown[programName]) {
      programBreakdown[programName] = {
        total: 0,
        active: 0,
        pending: 0,
        paused: 0,
        ended: 0,
      };
    }
    programBreakdown[programName].total++;
    programBreakdown[programName][enrollment.status.toLowerCase()]++;
  });

  return {
    type: "enrollment",
    generatedAt: new Date().toISOString(),
    byStatus: enrollmentsByStatus.map((item) => ({
      status: item.status,
      count: item._count,
    })),
    byProgram: Object.entries(programBreakdown).map(([name, data]) => ({
      programName: name,
      ...data,
    })),
  };
}

async function generateApplicationReport() {
  const applicationsByStatus = await db.application.groupBy({
    by: ["status"],
    _count: true,
  });

  const applicationsByProgram = await db.application.findMany({
    select: {
      status: true,
      program: {
        select: {
          name: true,
        },
      },
    },
  });

  // Group by program
  const programBreakdown: Record<string, any> = {};
  applicationsByProgram.forEach((application) => {
    const programName = application.program.name;
    if (!programBreakdown[programName]) {
      programBreakdown[programName] = {
        total: 0,
        draft: 0,
        submitted: 0,
        under_review: 0,
        approved: 0,
        waitlisted: 0,
        rejected: 0,
      };
    }
    programBreakdown[programName].total++;
    programBreakdown[programName][application.status.toLowerCase()]++;
  });

  // Calculate conversion rates
  const totalSubmitted = applicationsByStatus
    .filter((s) => s.status !== "DRAFT")
    .reduce((sum, s) => sum + s._count, 0);
  const totalApproved = applicationsByStatus.find((s) => s.status === "APPROVED")?._count || 0;

  return {
    type: "application",
    generatedAt: new Date().toISOString(),
    byStatus: applicationsByStatus.map((item) => ({
      status: item.status,
      count: item._count,
    })),
    byProgram: Object.entries(programBreakdown).map(([name, data]) => ({
      programName: name,
      ...data,
    })),
    conversionRate: totalSubmitted > 0 ? Math.round((totalApproved / totalSubmitted) * 100) : 0,
  };
}

async function generateCapacityReport() {
  const classes = await db.class.findMany({
    select: {
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

  const capacityData = classes.map((cls) => ({
    className: cls.name,
    programName: cls.program.name,
    capacity: cls.capacity,
    enrolled: cls._count.enrollments,
    available: cls.capacity - cls._count.enrollments,
    utilizationPercent: Math.round((cls._count.enrollments / cls.capacity) * 100),
  }));

  const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0);
  const totalEnrolled = classes.reduce((sum, c) => sum + c._count.enrollments, 0);
  const totalAvailable = totalCapacity - totalEnrolled;

  return {
    type: "capacity",
    generatedAt: new Date().toISOString(),
    summary: {
      totalCapacity,
      totalEnrolled,
      totalAvailable,
      overallUtilization: totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0,
    },
    byClass: capacityData,
  };
}

async function generateFinancialReport() {
  const enrollments = await db.enrollment.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      class: {
        select: {
          program: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Group enrollments by program
  const enrollmentsByProgram: Record<string, number> = {};

  enrollments.forEach((enrollment) => {
    const programName = enrollment.class.program.name;
    if (!enrollmentsByProgram[programName]) {
      enrollmentsByProgram[programName] = 0;
    }
    enrollmentsByProgram[programName]++;
  });

  return {
    type: "financial",
    generatedAt: new Date().toISOString(),
    note: "Financial reporting requires tuition fee configuration in the Program model",
    summary: {
      totalActiveEnrollments: enrollments.length,
      programCount: Object.keys(enrollmentsByProgram).length,
    },
    byProgram: Object.entries(enrollmentsByProgram).map(([name, count]) => ({
      programName: name,
      activeEnrollments: count,
    })),
  };
}
