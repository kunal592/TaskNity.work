
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    // Since we are using Clerk, logout is handled on the frontend by redirecting to the sign-out URL.
    // This backend endpoint is for any server-side cleanup if necessary.
    // We can use clerkClient to revoke the session if needed, but it's often not required.

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
