
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '@/lib/roleCheck';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const user = await requireRole(['ADMIN']);
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const classifiedTasks = await prisma.task.findMany({
      where: { classified: true },
      include: {
        project: true,
        assignees: true,
        createdBy: true,
      },
    });

    return NextResponse.json(classifiedTasks);
  } catch (error) {
    console.error('Error fetching classified tasks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
