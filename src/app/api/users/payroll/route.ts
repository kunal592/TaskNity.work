import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roleCheck";

// PUT: Admin can mark salary as “CREDITED” or “PENDING”
export async function PUT(request: Request) {
  try {
    await requireRole(["ADMIN"]);

    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return NextResponse.json({ error: "User ID and status are required" }, { status: 400 });
    }

    if (!['CREDITED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        salaryStatus: status,
        salaryLastUpdated: new Date(),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update salary status" }, { status: 500 });
  }
}

// GET: Fetch payroll summary (total paid, pending)
export async function GET(request: Request) {
    try {
        await requireRole(["ADMIN"]);

        const users = await prisma.user.findMany({
            where: {
                salary: {
                    not: null,
                },
            },
        });

        const totalPaid = users
            .filter(user => user.salaryStatus === 'CREDITED')
            .reduce((acc, user) => acc + (user.salary || 0), 0);

        const totalPending = users
            .filter(user => user.salaryStatus === 'PENDING')
            .reduce((acc, user) => acc + (user.salary || 0), 0);

        return NextResponse.json({
            totalPaid,
            totalPending,
        });

    } catch (error) {
        if (error instanceof Error && error.message === "Access denied") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to fetch payroll summary" }, { status: 500 });
    }
}
