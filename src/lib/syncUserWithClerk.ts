import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export const syncUserWithClerk = async () => {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        id: userId,
        name: `${sessionClaims?.firstName} ${sessionClaims?.lastName}`,
        email: sessionClaims?.email as string,
        role: "MEMBER",
      },
    });
  }
};
