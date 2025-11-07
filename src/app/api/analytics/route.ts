import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const mockAnalyticsData = {
  expenseTotal: 3700,
  revenueTotal: 5000,
  growthRate: 15,
  growthHistory: [
    { name: 'Jan', Revenue: 4000, Expense: 2400 },
    { name: 'Feb', Revenue: 3000, Expense: 1398 },
    { name: 'Mar', Revenue: 2000, Expense: 9800 },
    { name: 'Apr', Revenue: 2780, Expense: 3908 },
    { name: 'May', Revenue: 1890, Expense: 4800 },
    { name: 'Jun', Revenue: 2390, Expense: 3800 },
  ],
};

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  return NextResponse.json(mockAnalyticsData);
}
