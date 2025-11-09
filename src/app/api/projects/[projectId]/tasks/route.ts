
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '@/lib/roleCheck';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const user = await requireRole(['ADMIN', 'MEMBER']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      include: { members: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isMember = project.members.some((m) => m.userId === user.id);

    if (user.role !== 'ADMIN' && !project.visibility && !isMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: params.projectId },
      include: {
        assignees: true,
        createdBy: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
