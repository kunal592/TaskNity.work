import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/roleCheck";

export async function GET() {
  try {
    await requireRole("ADMIN");
    const users = await prisma.user.findMany({
      include: {
        tasks: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireRole("ADMIN");
    const newUser = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email: newUser.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        ...newUser,
        role: "MEMBER", 
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
