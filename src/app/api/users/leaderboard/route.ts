import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      include: {
        tasks: {
          where: {
            status: 'DONE',
          },
        },
      },
    });

    const leaderboard = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      completedTasks: user.tasks.length,
    })).sort((a, b) => b.completedTasks - a.completedTasks);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
