import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Seed data
    const users = await prisma.user.createMany({
        data: [
            { id: 'user_2aP9Z6V7bCDEfGH8iJ9kLmnOPQR', email: 'admin@example.com', role: 'ADMIN' },
            { id: 'user_2aP9X4Y5zABCdEF6gH7iJklMNOP', email: 'member@example.com', role: 'MEMBER' },
        ],
        skipDuplicates: true,
    });

    const projects = await prisma.project.createMany({
        data: [
            { title: 'Project Alpha', description: 'This is a public project.', visibility: 'PUBLIC' },
            { title: 'Project Omega', description: 'This is a private project for the admin.', visibility: 'PRIVATE' },
        ],
        skipDuplicates: true,
    });

    // For simplicity, we're just creating some data. In a real scenario, you would link them.
    
    return NextResponse.json({ 
        message: "Database seeded successfully",
        data: {
            users,
            projects
        }
    });
  } catch (error) {
    console.error("Seeding failed:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
