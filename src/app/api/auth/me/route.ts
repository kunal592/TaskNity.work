
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
