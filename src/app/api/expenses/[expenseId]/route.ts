
import { NextResponse } from 'next/server';
import { PrismaClient, ExpenseStatus } from '@prisma/client';
import { roleCheck } from '@/lib/roleCheck';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { expenseId: string } }
) {
  try {
    const user = await roleCheck();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    const updatedExpense = await prisma.expense.update({
      where: { id: params.expenseId },
      data: {
        status: status as ExpenseStatus,
        approvedById: user.id,
      },
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
