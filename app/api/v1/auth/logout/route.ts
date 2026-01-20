import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // For NextAuth, logout is handled client-side by calling signOut()
  // This endpoint can be used for additional server-side cleanup if needed

  return NextResponse.json({ message: "Logged out successfully" });
}
