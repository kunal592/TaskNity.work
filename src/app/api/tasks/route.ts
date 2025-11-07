import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roleCheck";
import { validateRequest, taskSchema } from "@/lib/validate";

// GET: Return tasks with optional filters
export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const isDraft = searchParams.get("isDraft") === "true";
    const classified = searchParams.get("classified") === "true";

    let where: any = {};
    if (user.role !== "ADMIN") {
      where.assignees = { some: { userId: userId } };
    }

    if (searchParams.has("isDraft")) {
        where.isDraft = isDraft;
    }

    if (searchParams.has("classified")) {
        where.classified = classified;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignees: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST: Create new task (Admin only)
export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const {
        title,
        description,
        priority,
        projectId,
        deadline,
        classified,
        isDraft,
        status,
        assignedTo,
    } = await validateRequest(request, taskSchema);

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        deadline,
        classified,
        isDraft,
        status,
        project: {
          connect: { id: projectId },
        },
        assignees: {
          create: assignedTo.map((userId: string) => ({
            user: {
              connect: { id: userId },
            },
          })),
        },
      },
      include: {
        assignees: true,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
        if (error.message.includes('Access denied')) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// PUT: Update status or details
export async function PUT(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignees: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && !task.assignees.some((assignee) => assignee.userId === userId)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const data = await validateRequest(request, taskSchema.partial());
    const { assignedTo, ...updateData } = data;


    let updatedTask;
    if (assignedTo && user.role === 'ADMIN') { // Only admins can reassign
        updatedTask = await prisma.$transaction(async (tx) => {
            await tx.taskAssignee.deleteMany({
                where: { taskId: taskId },
            });

            await tx.taskAssignee.createMany({
                data: assignedTo.map((userId: string) => ({
                    taskId: taskId,
                    userId: userId,
                })),
            });

            return tx.task.update({
                where: { id: taskId },
                data: updateData,
                 include: {
                    assignees: {
                      include: {
                        user: true
                      }
                    },
                },
            });
        });
    } else {
        updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
             include: {
                assignees: {
                  include: {
                    user: true
                  }
                },
            },
        });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
     if (error instanceof Error) {
        if (error.message.includes('Access denied')) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE: Remove task (Admin only)
export async function DELETE(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
        await tx.taskAssignee.deleteMany({
            where: {
                taskId: taskId,
            },
        });

        await tx.task.delete({
            where: {
                id: taskId,
            },
        });
    })

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
