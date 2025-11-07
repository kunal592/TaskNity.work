import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roleCheck";
import { validateRequest, projectSchema } from "@/lib/validate";

// GET: Return projects user has access to
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

    let projects;
    if (user.role === "ADMIN") {
      // Admins see all projects
      projects = await prisma.project.findMany({
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
    } else {
      // Members see public projects and projects they are assigned to
      projects = await prisma.project.findMany({
        where: {
          OR: [
            {
              visibility: "PUBLIC",
            },
            {
              members: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST: Create new project (Admin only)
export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const  {
      title,
      description,
      visibility,
      members
    } = await validateRequest(request, projectSchema);

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        visibility,
        ...(members && {
          members: {
            create: members.map((userId: string) => ({
              user: {
                connect: { id: userId },
              },
            })),
          },
        }),
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
        if (error.message.includes('Access denied')) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

// PUT: Update title, members, or visibility
export async function PUT(request: Request) {
    try {
        await requireRole(["ADMIN"]);
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("id");

        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        const {
          title,
          description,
          visibility,
          members
        } = await validateRequest(request, projectSchema.partial());

        let updatedProject;

        if (members) {
             updatedProject = await prisma.$transaction(async (tx) => {
                await tx.projectMember.deleteMany({
                    where: { projectId: projectId },
                });

                await tx.projectMember.createMany({
                    data: members.map((userId: string) => ({
                        projectId: projectId,
                        userId: userId,
                    })),
                });

                return tx.project.update({
                    where: { id: projectId },
                    data: {
                        ...(title && { title }),
                        ...(description && { description }),
                        ...(visibility && { visibility }),
                    },
                     include: {
                        members: {
                          include: {
                            user: true
                          }
                        },
                    },
                });
            });
        } else {
            updatedProject = await prisma.project.update({
                where: { id: projectId },
                data: {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(visibility && { visibility }),
                },
                 include: {
                    members: {
                       include: {
                        user: true
                      }
                    },
                },
            });
        }
        return NextResponse.json(updatedProject);

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Access denied')) {
                return NextResponse.json({ error: "Access denied" }, { status: 403 });
            }
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}


// DELETE: Delete project (Admin only)
export async function DELETE(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }
    
    await prisma.$transaction(async (tx) => {
      await tx.projectMember.deleteMany({
          where: {
              projectId: projectId,
          },
      });
      await tx.project.delete({
          where: {
              id: projectId,
          },
      });
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
