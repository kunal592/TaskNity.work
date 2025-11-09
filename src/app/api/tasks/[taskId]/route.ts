
import { NextResponse } from 'next/server';
import { PrismaClient, TaskStatus, Priority } from '@prisma/client';
import { roleCheck } from '@/lib/roleCheck';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const user = await roleCheck();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, status, priority, dueDate, assignees, draft, classified } = body;

    const task = await prisma.task.findUnique({
      where: { id: params.taskId },
      include: { project: { include: { members: true } } },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const isMember = task.project?.members.some((m) => m.userId === user.id);

    if (user.role !== 'ADMIN' && task.createdById !== user.id && !isMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        title,
        description,
        status: status as TaskStatus,
        priority: priority as Priority,
        dueDate,
        draft,
        classified,
        assignees: {
          set: assignees.map((id: string) => ({ id })),
        },
      },
      include: {
        assignees: true,
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
  { params }: { params: { taskId: string } }
) {
  try {
    const user = await roleCheck();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findUnique({
        where: { id: params.taskId },
        include: { project: { include: { members: true } } },
      });
  
      if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
  
      const isMember = task.project?.members.some((m) => m.userId === user.id);
  
      if (user.role !== 'ADMIN' && task.createdById !== user.id && !isMember) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

    await prisma.task.delete({
      where: { id: params.taskId },
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
