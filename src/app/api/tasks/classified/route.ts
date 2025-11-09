
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { roleCheck } from '@/lib/roleCheck';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const user = await roleCheck();
    if (!user || user.role !== 'ADMIN') {
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
