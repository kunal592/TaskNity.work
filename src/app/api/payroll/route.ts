import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roleCheck";

// GET: Return all payrolls (Admin only)
export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN"]);

    const payrolls = await prisma.payroll.findMany({
      include: {
        payrollUsers: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(payrolls);
  } catch (error) {
    if (error instanceof Error && error.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch payrolls" }, { status: 500 });
  }
}

// POST: Process payroll (Admin only)
export async function POST(request: Request) {
    try {
        await requireRole(["ADMIN"]);

        const body = await request.json();
        const { month, year } = body;

        if (!month || !year) {
            return NextResponse.json({ error: "Month and year are required" }, { status: 400 });
        }

        const users = await prisma.user.findMany({
            where: {
                role: "MEMBER",
                salary: { not: null },
            },
        });

        if (users.length === 0) {
            return NextResponse.json({ message: "No users with salary information to process." });
        }

        const newPayroll = await prisma.$transaction(async (tx) => {
            const payroll = await tx.payroll.create({
                data: {
                    month,
                    year,
                    totalAmount: users.reduce((acc, user) => acc + (user.salary || 0), 0),
                },
            });

            const payrollUsersData = users.map(user => ({
                payrollId: payroll.id,
                userId: user.id,
                amount: user.salary || 0,
            }));

            await tx.payrollUser.createMany({
                data: payrollUsersData,
            });

            return tx.payroll.findUnique({
                where: { id: payroll.id },
                include: {
                    payrollUsers: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
        });

        return NextResponse.json(newPayroll, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "Access denied") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to process payroll" }, { status: 500 });
    }
}


// PUT: Update payroll status (Admin only)
export async function PUT(request: Request) {
  try {
    await requireRole(["ADMIN"]);

    const { searchParams } = new URL(request.url);
    const payrollId = searchParams.get("id");

    if (!payrollId) {
      return NextResponse.json({ error: "Payroll ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updatedPayroll = await prisma.payroll.update({
      where: { id: payrollId },
      data: {
        status,
      },
       include: {
        payrollUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPayroll);
  } catch (error) {
    if (error instanceof Error && error.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update payroll status" }, { status: 500 });
  }
}
