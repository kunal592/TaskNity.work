import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { notices } from '@/store/mockNotices';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    const { feedback } = await req.json();

    const noticeIndex = notices.findIndex(n => n.id === id);
    if (noticeIndex === -1) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    notices[noticeIndex].status = 'responded';
    notices[noticeIndex].feedback = feedback;

    return NextResponse.json(notices[noticeIndex]);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id);
  const noticeIndex = notices.findIndex(n => n.id === id);

  if (noticeIndex === -1) {
    return NextResponse.json({ error: "Notice not found" }, { status: 404 });
  }

  notices.splice(noticeIndex, 1);

  return NextResponse.json({ message: "Notice deleted" }, { status: 200 });
}
