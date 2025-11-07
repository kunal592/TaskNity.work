import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { notices, Notice } from '@/store/mockNotices';

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(notices);
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newNotice: Omit<Notice, 'id'> = await req.json();
    const newId = notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1;
    const finalNotice: Notice = { ...newNotice, id: newId, date: new Date().toISOString().split('T')[0], status: 'pending' };
    notices.push(finalNotice);
    return NextResponse.json(finalNotice, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
