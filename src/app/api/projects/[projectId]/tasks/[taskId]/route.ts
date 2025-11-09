
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '@/lib/roleCheck';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { projectId: string; taskId: string } }
) {
  try {
    const user = await requireRole(['ADMIN', 'MEMBER']);
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: params.taskId,
        projectId: params.projectId,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { projectId: string; taskId: string } }
) {
  try {
    const user = await requireRole(['ADMIN', 'MEMBER']);
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, status, priority, dueDate } = body;

    const updatedTask = await prisma.task.update({
      where: {
        id: params.taskId,
        projectId: params.projectId,
      },
      data: {
        title,
        description,
        status,
        priority,
        dueDate,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string; taskId: string } }
) {
  try {
    const user = await requireRole(['ADMIN']);
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.task.delete({
      where: {
        id: params.taskId,
        projectId: params.projectId,
      },
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
