import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { Role } from "@/types";

export const requireRole = async (allowedRoles: Role[]) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Access denied");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("Access denied");
  }

  return user;
};
