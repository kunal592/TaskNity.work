
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { roleCheck } from '@/lib/roleCheck';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await roleCheck();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'ADMIN' && user.id !== params.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const attendance = await prisma.attendance.findMany({
      where: { userId: params.userId },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
