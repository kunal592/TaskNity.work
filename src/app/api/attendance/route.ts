
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { AttendanceStatus } from '@prisma/client';

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userAttendance = await prisma.attendance.findMany({
      where: { userId },
    });
    return NextResponse.json(userAttendance);
  } catch (error) {
    console.error("Failed to fetch attendance:", error);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = (await req.json()) as { status: AttendanceStatus };
    const today = new Date().toISOString().split('T')[0];

    const existingEntry = await prisma.attendance.findFirst({
      where: {
        userId,
        date: new Date(today),
      },
    });

    if (existingEntry) {
      const updatedEntry = await prisma.attendance.update({
        where: { id: existingEntry.id },
        data: { status },
      });
      return NextResponse.json(updatedEntry);
    }

    const newEntry = await prisma.attendance.create({
      data: {
        userId,
        date: new Date(today),
        status,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Failed to update attendance:", error);
    return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 });
  }
}
