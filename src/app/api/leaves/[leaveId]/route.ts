
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { roleCheck } from '@/lib/roleCheck';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { leaveId: string } }
) {
  try {
    const user = await roleCheck();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    const updatedLeave = await prisma.leave.update({
      where: { id: params.leaveId },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedLeave);
  } catch (error) {
    console.error('Error updating leave request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
