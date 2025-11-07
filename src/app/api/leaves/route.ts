import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { requireRole } from "@/lib/roleCheck";

// POST: Request for a leave
export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reason, startDate, endDate } = await request.json();

    if (!reason || !startDate || !endDate) {
      return NextResponse.json({ error: "Reason, start date, and end date are required" }, { status: 400 });
    }

    const leaveRequest = await prisma.leave.create({
      data: {
        userId,
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(leaveRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create leave request" }, { status: 500 });
  }
}

// GET: Fetch leave requests
export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let leaveRequests;
    if (user.role === "ADMIN") {
      // Admins can see all leave requests
      leaveRequests = await prisma.leave.findMany();
    } else {
      // Members can only see their own leave requests
      leaveRequests = await prisma.leave.findMany({
        where: { userId },
      });
    }

    return NextResponse.json(leaveRequests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leave requests" }, { status: 500 });
  }
}

// PUT: Update leave request status (Admin only)
export async function PUT(request: Request) {
    try {
        await requireRole(["ADMIN"]);
        const { searchParams } = new URL(request.url);
        const leaveId = searchParams.get("id");
        const { status } = await request.json();

        if (!leaveId || !status) {
            return NextResponse.json({ error: "Leave ID and status are required" }, { status: 400 });
        }

        const updatedLeave = await prisma.leave.update({
            where: { id: leaveId },
            data: { status },
        });

        return NextResponse.json(updatedLeave);

    } catch (error) {
        if (error instanceof Error && error.message === "Access denied") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to update leave status" }, { status: 500 });
    }
}
