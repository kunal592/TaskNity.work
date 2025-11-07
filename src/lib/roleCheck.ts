import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const requireRole = async (requiredRole: UserRole) => {
  const { userId } = auth();
  if (!userId) {
    throw new AuthError("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== requiredRole) {
    throw new AuthError("Forbidden");
  }
};

export const handleAuthError = (error: any) => {
  if (error instanceof AuthError) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return NextResponse.json({ error: error.message }, { status });
  }
  console.error("An unexpected error occurred:", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
};
