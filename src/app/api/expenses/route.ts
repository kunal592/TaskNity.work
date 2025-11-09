
import { NextResponse } from 'next/server';
import { PrismaClient, ExpenseStatus } from '@prisma/client';
import { requireRole } from '@/lib/roleCheck';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const user = await requireRole(['ADMIN']);
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const expenses = await prisma.expense.findMany({
      include: {
        requestedBy: true,
        approvedBy: true,
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
