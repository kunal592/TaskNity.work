import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole, TaskStatus, AttendanceStatus } from "@prisma/client";

export async function POST() {
  try {
    // Clear existing data to avoid conflicts on re-seeding
    await prisma.task.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.leave.deleteMany({});
    await prisma.user.deleteMany({});

    // Seed Users
    const users = await prisma.user.createMany({
      data: [
        {
          id: "user_admin_1",
          email: "admin1@example.com",
          name: "Admin User 1",
          role: UserRole.ADMIN,
        },
        {
          id: "user_admin_2",
          email: "admin2@example.com",
          name: "Admin User 2",
          role: UserRole.ADMIN,
        },
        {
          id: "user_member_1",
          email: "member1@example.com",
          name: "Member User 1",
          role: UserRole.MEMBER,
        },
        {
          id: "user_member_2",
          email: "member2@example.com",
          name: "Member User 2",
          role: UserRole.MEMBER,
        },
        {
          id: "user_member_3",
          email: "member3@example.com",
          name: "Member User 3",
          role: UserRole.MEMBER,
        },
        {
          id: "user_viewer_1",
          email: "viewer1@example.com",
          name: "Viewer User 1",
          role: UserRole.VIEWER,
        },
      ],
      skipDuplicates: true,
    });

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Seed Attendance
    const attendance = await prisma.attendance.createMany({
      data: [
        {
          userId: "user_member_1",
          date: yesterday,
          status: AttendanceStatus.PRESENT,
        },
        {
          userId: "user_member_2",
          date: yesterday,
          status: AttendanceStatus.ABSENT,
        },
        {
          userId: "user_member_1",
          date: today,
          status: AttendanceStatus.PRESENT,
        },
        {
          userId: "user_admin_1",
          date: today,
          status: AttendanceStatus.PRESENT,
        },
      ],
      skipDuplicates: true,
    });

    // Seed Tasks
    const tasks = await prisma.task.createMany({
      data: [
        {
          title: "Complete project proposal",
          status: TaskStatus.IN_PROGRESS,
          userId: "user_member_1",
        },
        {
          title: "Review design mockups",
          status: TaskStatus.DONE,
          userId: "user_member_1",
        },
        {
          title: "Develop new feature",
          status: TaskStatus.TODO,
          userId: "user_member_2",
        },
        {
          title: "Deploy to staging",
          status: TaskStatus.TODO,
          userId: "user_admin_1",
        },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: "Seed data created successfully!",
      users,
      attendance,
      tasks,
    });
  } catch (error) {
    console.error("Failed to seed data:", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
