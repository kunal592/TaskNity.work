import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/roleCheck";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole("ADMIN");
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        tasks: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole("ADMIN");
    const updates = await req.json();

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updates,
    });
    return NextResponse.json(user);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole("ADMIN");
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return handleAuthError(error);
  }
}
