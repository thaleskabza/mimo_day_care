import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/v1/programs
 * Get all programs (public endpoint for parents to view available programs)
 */
export async function GET(request: NextRequest) {
  try {
    const programs = await db.program.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        ageMinMonths: true,
        ageMaxMonths: true,
        isActive: true,
      },
      where: {
        isActive: true,
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
