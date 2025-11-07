import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roleCheck";

// POST: Create a notice (Admin only)
export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
  }
}

// GET: Fetch all notices
export async function GET(request: Request) {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(notices);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}
