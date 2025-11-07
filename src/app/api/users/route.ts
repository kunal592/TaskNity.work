import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roleCheck";
import { validateRequest, userSchema } from "@/lib/validate";

// GET: Return all users (Admin only)
export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null, // Exclude soft-deleted users
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
}

// POST: Add new user (Admin only)
export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const data = await validateRequest(request, userSchema);

    const newUser = await prisma.user.create({
      data,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
        if (error.message.includes('Access denied')) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// PUT: Update role or salary
export async function PUT(request: Request) {
    try {
        await requireRole(["ADMIN"]);
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const data = await validateRequest(request, userSchema.partial());

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Access denied')) {
                return NextResponse.json({ error: "Access denied" }, { status: 403 });
            }
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}


// DELETE: Soft delete user
export async function DELETE(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "User soft-deleted successfully" });
  } catch (error) {
     if (error instanceof Error && error.message === "Access denied") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
