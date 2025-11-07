import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // 1. Test Clerk Authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Clerk authentication failed: Not logged in" }, { status: 401 });
    }

    // 2. Test Database Connection
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
        return NextResponse.json({ error: "Database query failed: User not found in DB" }, { status: 404 });
    }

    return NextResponse.json({ 
        message: "Connection test successful!",
        data: {
            clerkUserId: userId,
            databaseUser: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
    });

  } catch (error) {
    console.error("Connection test failed:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
