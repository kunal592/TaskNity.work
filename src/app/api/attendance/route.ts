import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roleCheck";
import { auth } from "@clerk/nextjs/server";

// POST: Mark attendance (Admin only)
export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { userId, status, date } = await request.json();

    if (!userId || !status || !date) {
      return NextResponse.json({ error: "User ID, status, and date are required" }, { status: 400 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        status,
        date: new Date(date),
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 });
  }
}

// GET: Fetch attendance for a user
export async function GET(request: Request) {
    try {
        const { userId: currentUserId } = auth();
        if (!currentUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { id: currentUserId }});
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const userIdToFetch = searchParams.get("userId");

        // Regular members can only fetch their own attendance
        if (user.role !== 'ADMIN' && userIdToFetch && userIdToFetch !== currentUserId) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const attendance = await prisma.attendance.findMany({
            where: {
                userId: userIdToFetch || currentUserId,
            },
        });

        return NextResponse.json(attendance);

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
    }
}
