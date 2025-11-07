import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roleCheck";

// GET: Admin view (all expenses) or user's own expenses.
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

    let expenses;
    if (user.role === "ADMIN") {
      expenses = await prisma.expense.findMany({
        include: {
          user: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
      });
    } else {
        expenses = await prisma.expense.findMany({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

// POST: Create new expense request.
export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, amount, category } = body;

    const newExpense = await prisma.expense.create({
      data: {
        title,
        description,
        amount,
        category,
        user: {
            connect: { id: userId }
        },
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create expense request" }, { status: 500 });
  }
}

// PUT: Approve/Reject expense (Admin only).
export async function PUT(request: Request) {
  try {
    await requireRole(["ADMIN"]);

    const { searchParams } = new URL(request.url);
    const expenseId = searchParams.get("id");

    if (!expenseId) {
      return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

     if (!status || !['Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    if (error instanceof Error && error.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
}
