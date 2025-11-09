
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { roleCheck } from '@/lib/roleCheck';

const prisma = new PrismaClient();

// ... (existing GET and PUT functions)

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await roleCheck();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
